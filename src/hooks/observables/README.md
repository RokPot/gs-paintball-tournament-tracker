# RxDB Observable Hooks

This directory contains hooks that use RxDB observables for reactive data management. These hooks automatically update when the underlying database data changes, eliminating the need for manual cache invalidation.

**📋 For implementation status and next steps, see [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)**

## Benefits

- **Automatic Updates**: No manual invalidation needed - components update automatically when data changes
- **Better Performance**: Only updates what changed, not entire query results
- **Real-time**: Immediate updates across all subscribed components
- **Offline-first**: Works seamlessly offline, syncs when online

## Available Hooks

### `useActiveStateObservable()`
Reactively observes the active state (leagueId, tournamentId, gameId).

```tsx
const activeState = useActiveStateObservable();
// Returns: { leagueId, tournamentId, gameId } | null
```

### `useTournamentObservable(tournamentId)`
Reactively observes a tournament and all its games. Automatically updates when:
- Tournament document changes
- Any game in the tournament changes

```tsx
const tournament = useTournamentObservable(tournamentId);
// Returns: Tournament | null
// Automatically updates when any game in the tournament changes!
```

### `usePopulatedActiveState()`
Combines active state IDs with populated objects. Returns fully populated League, Tournament, and Game objects that update reactively.

```tsx
const { league, tournament, game, isLoading } = usePopulatedActiveState();
// All objects automatically update when any related data changes
```

## Migration Guide

### Replacing React Query with Observables

#### Before (React Query):
```tsx
// Old way - requires manual invalidation
const { data: tournament } = useQuery({
  queryKey: ['tournament', tournamentId],
  queryFn: () => getTournament(tournamentId),
});

// After updating a game:
await updateGame(game);
await invalidateQueries({ queryKey: ['tournament', tournamentId] }); // ❌ Manual invalidation
```

#### After (RxDB Observables):
```tsx
// New way - automatic updates
const tournament = useTournamentObservable(tournamentId);

// After updating a game:
await updateGame(game);
// ✅ Tournament automatically updates - no invalidation needed!
```

### When to Use Which

**Use RxDB Observables for:**
- ✅ Frequently updated data (games, scores, match states)
- ✅ Data that needs real-time updates
- ✅ Local database data (leagues, tournaments, games)
- ✅ Complex nested relationships that change frequently

**Keep React Query for:**
- ✅ External API calls
- ✅ Server-side data fetching
- ✅ One-time data loads
- ✅ Network requests with retry logic

## How It Works

RxDB observables use the `$` property on queries to create reactive streams:

```tsx
database.collections.tournaments
  .findOne({ selector: { _id: tournamentId } })
  .$.subscribe((tournamentDoc) => {
    // This callback fires whenever:
    // 1. Tournament document changes
    // 2. Any related document changes (if using reactive queries)
  });
```

When you update a game:
```tsx
await gameDoc.incrementalModify(data => ({ ...data, score: 100 }));
```

The tournament observable automatically detects the change and re-populates the tournament with fresh game data.

## Example: Game Updates

**Old approach (React Query):**
```tsx
const updateGame = async (game: Game) => {
  await updateGameMutation(game);
  await invalidateSelectedLeague(); // ❌ Causes full refetch cascade
  // - League refetches
  // - All tournaments refetch
  // - All games refetch
};
```

**New approach (RxDB Observables):**
```tsx
const updateGame = async (game: Game) => {
  await updateGameMutation(game);
  // ✅ Tournament automatically updates via observable
  // ✅ Only changed game data is updated
  // ✅ No refetch cascade
};
```

## Testing

To test observable hooks:

1. Use the hook in a component
2. Update the underlying data (e.g., update a game)
3. Verify the component automatically re-renders with new data
4. No manual invalidation should be needed

## Future Enhancements

- [ ] Create `useLeagueObservable` hook
- [ ] Create `useGameObservable` hook
- [ ] Add loading/error states to observable hooks
- [ ] Add debouncing for frequent updates
- [ ] Add optimistic updates support

