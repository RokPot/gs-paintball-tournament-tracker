# RxDB Observables Implementation Status

## Overview

This document tracks the implementation of RxDB observables for reactive data management, replacing manual cache invalidation with automatic real-time updates.

## What Was Implemented

### ✅ Completed

1. **Tournament Population Utility** (`src/utils/tournamentPopulationUtils.ts`)
   - Extracted reusable tournament population logic
   - Used by both services and observables
   - Functions: `populateTournamentTeams`, `collectGameIdsFromTournament`, `populateTournamentStages`, `populateTournament`

2. **Active State Infrastructure**
   - Created `IActiveState` interface (singleton table for active league/tournament/game)
   - Created `activeStateSchema.ts` for RxDB collection
   - Added `activeState` collection to database
   - Created `ActiveStateServiceRxDB.tsx` with singleton management
   - Created `ActiveStateQueries.tsx` with React Query hooks

3. **Observable Hooks**
   - ✅ `useActiveStateObservable()` - Reactively observes active state IDs
   - ✅ `useTournamentObservable(tournamentId)` - Reactively observes tournament + games
   - ✅ `usePopulatedActiveState()` - Combines IDs with populated objects

4. **Service Refactoring**
   - Refactored `TournamentServiceRxDB` to use shared population utility
   - Updated `GameQueries` with comments explaining automatic updates

5. **Testing & Documentation**
   - Created debug panel (`ActiveStateDebugPanel.tsx`) on HomePage (dev only)
   - Created migration guide (`README.md`)
   - Added comments explaining automatic reactivity

## Architecture

### How It Works

RxDB observables use the `$` property on queries to create reactive streams:

```tsx
database.collections.tournaments
  .findOne({ selector: { _id: tournamentId } })
  .$.subscribe((tournamentDoc) => {
    // Automatically fires when tournament OR related games change
  });
```

When you update a game:
```tsx
await gameDoc.incrementalModify(data => ({ ...data, score: 100 }));
```

The tournament observable automatically detects the change and re-populates the tournament with fresh game data - **no manual invalidation needed!**

### Key Benefits

- **Automatic Updates**: Components update when data changes, no manual invalidation
- **Better Performance**: Only updates what changed, not entire query results
- **Real-time**: Immediate updates across all subscribed components
- **Simpler Code**: Less invalidation logic scattered throughout codebase

### Subscription Lifecycle

**Important**: Each component subscription is independent. When a component:
- **Unmounts**: Subscription is automatically cleaned up
- **Remounts**: New subscription starts and receives current state + future updates
- **No manual refetch needed** - subscriptions work out-of-the-box!

## Current Usage

### Active State System

The app now has two parallel systems:

1. **Old System** (still in use):
   - `isLeagueSelected` flag on League documents
   - `useActiveLeague()` via React Query
   - Manual invalidation required

2. **New System** (ready to use):
   - `activeState` singleton table with `leagueId`, `tournamentId`, `gameId`
   - `useActiveStateObservable()` + `usePopulatedActiveState()`
   - Automatic updates

### Observable Hooks Available

```tsx
// Get active state IDs
const activeState = useActiveStateObservable();
// Returns: { leagueId, tournamentId, gameId } | null

// Get reactive tournament
const tournament = useTournamentObservable(tournamentId);
// Automatically updates when tournament or games change

// Get fully populated active state
const { league, tournament, game, isLoading } = usePopulatedActiveState();
// All objects update reactively when data changes
```

## What's Left To Do

### 🔄 High Priority

1. **Migrate Active State Management**
   - [ ] Update `useLeagueFlows.ts` to use `ActiveStateServiceRxDB` instead of `isLeagueSelected` flag
   - [ ] Update `TournamentContext` to use `usePopulatedActiveState()` instead of `useActiveLeague()`
   - [ ] Remove `isLeagueSelected` flag from League schema (after migration)
   - [ ] Migrate data: Move existing `isLeagueSelected` data to `activeState` table

2. **Create Additional Observable Hooks**
   - [ ] `useLeagueObservable(leagueId)` - For reactive league data
   - [ ] `useGameObservable(gameId)` - For reactive game data
   - [ ] Update `usePopulatedActiveState` to use these instead of manual subscriptions

3. **Add Loading/Error States**
   - [ ] Add `isLoading` and `error` states to `useTournamentObservable`
   - [ ] Add `isLoading` and `error` states to `useActiveStateObservable`
   - [ ] Standardize error handling across all observable hooks

### 📋 Medium Priority

4. **Performance Optimizations**
   - [ ] Add debouncing for frequent game updates (if needed)
   - [ ] Optimize game subscription in `useTournamentObservable` (only subscribe to games that exist)
   - [ ] Consider batching updates for multiple rapid changes

5. **Testing**
   - [ ] Test unmount/remount behavior (verify subscriptions work correctly)
   - [ ] Test with multiple components using same observable
   - [ ] Test game updates triggering tournament updates
   - [ ] Test active state changes propagating correctly

6. **Documentation**
   - [ ] Add JSDoc examples to all hooks
   - [ ] Document best practices for when to use observables vs React Query
   - [ ] Create migration checklist for components

### 🔮 Low Priority / Future Enhancements

7. **Advanced Features**
   - [ ] Optimistic updates for game mutations
   - [ ] Conflict resolution for concurrent updates
   - [ ] Offline queue management
   - [ ] Real-time sync across browser tabs (if needed)

8. **Code Cleanup**
   - [ ] Remove old `isLeagueSelected` code after migration
   - [ ] Remove unused React Query invalidations
   - [ ] Consolidate duplicate population logic

## Migration Path

### Phase 1: Test & Validate (Current)
- ✅ Observable hooks created
- ✅ Debug panel added
- ⏳ Testing in progress

### Phase 2: Gradual Migration
1. Replace `useActiveLeague()` with `usePopulatedActiveState()` in `TournamentContext`
2. Update league selection flows to use `ActiveStateServiceRxDB`
3. Test thoroughly

### Phase 3: Full Migration
1. Remove `isLeagueSelected` flag
2. Remove old React Query invalidations
3. Clean up unused code

### Phase 4: Optimization
1. Add loading/error states
2. Optimize subscriptions
3. Add performance monitoring

## How to Use

### For New Components

Use observable hooks for frequently updated data:

```tsx
// Instead of React Query:
const { data: tournament } = useQuery({
  queryKey: ['tournament', tournamentId],
  queryFn: () => getTournament(tournamentId),
});

// Use observables:
const tournament = useTournamentObservable(tournamentId);
// Automatically updates when games change!
```

### For Game Updates

No manual invalidation needed:

```tsx
// Old way:
await updateGame(game);
await invalidateSelectedLeague(); // ❌ Manual invalidation

// New way:
await updateGame(game);
// ✅ Tournament automatically updates via observable
```

## Debug Tools

### ActiveStateDebugPanel

Located at: `src/components/dev/ActiveStateDebugPanel.tsx`

Shows on HomePage in development mode:
- Active state IDs
- Populated league/tournament/game names
- Last updated timestamp
- Loading state

Use this to verify:
1. Active state changes are reflected
2. Game updates trigger tournament updates
3. Unmount/remount behavior works correctly

## Important Notes

1. **No Global State Needed**: Each subscription is independent. Components can unmount/remount freely.

2. **Hybrid Approach**: We're using both React Query and observables:
   - **Observables**: Local database data (leagues, tournaments, games)
   - **React Query**: External APIs, one-time fetches

3. **Backward Compatible**: Old system still works. Migration is gradual.

4. **Performance**: Observable subscriptions are efficient - only fire when data actually changes.

## Files Reference

### Core Implementation
- `src/hooks/observables/useActiveStateObservable.tsx` - Active state observer
- `src/hooks/observables/useTournamentObservable.tsx` - Tournament + games observer
- `src/hooks/observables/usePopulatedActiveState.tsx` - Combined populated state
- `src/utils/tournamentPopulationUtils.ts` - Shared population logic

### Services
- `src/services/ActiveStateServiceRxDB.tsx` - Active state CRUD
- `src/services/queries/activeState/ActiveStateQueries.tsx` - React Query hooks

### Database
- `src/services/rxdb/schemas/activeStateSchema.ts` - Active state schema
- `src/services/rxdb/database.ts` - Database configuration

### Testing
- `src/components/dev/ActiveStateDebugPanel.tsx` - Debug panel

### Documentation
- `src/hooks/observables/README.md` - Migration guide

## Next Steps for New Session

1. **Review this document** to understand current state
2. **Test the debug panel** to verify everything works
3. **Choose a component** to migrate (start with `TournamentContext`)
4. **Follow migration path** step by step
5. **Test thoroughly** after each change

## Questions to Answer

- [ ] Does unmount/remount work correctly? (Test with debug panel)
- [ ] Do game updates trigger tournament updates? (Test by updating a game)
- [ ] Are there any performance issues with multiple subscriptions?
- [ ] Should we add loading/error states before migration?

---

**Last Updated**: 2024
**Status**: ✅ Infrastructure Complete, ⏳ Migration In Progress

