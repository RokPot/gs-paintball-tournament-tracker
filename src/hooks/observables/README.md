# RxDB Observable Hooks

This directory contains hooks that use RxDB observables for reactive data management.
They update when the underlying database documents change.

**Status:** see [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)

## Available Hooks

All hooks return `{ data, isLoading, error }`.

### `useActiveStateObservable()`
Observes the singleton active state (`leagueId`, `tournamentId`, `gameId`).

### `useTournamentObservable(tournamentId)`
Observes a tournament and re-populates when the tournament or its games change.

### `useLeagueObservable(leagueId)`
Observes a league document and re-populates teams, tournaments, and leaderboard.

### `useGameObservable(gameId)`
Observes a single game document.

### `usePopulatedActiveState()`
Combines the IDs above into populated `league`, `tournament`, and `game` objects.
Used by `TournamentContext`.

```tsx
const { league, tournament, game, isLoading, error } = usePopulatedActiveState();
```

## When to Use Which

**Use RxDB observables for:**
- Active league / tournament / game
- Data that should update live after local writes (scores, schedule)

**Keep React Query for:**
- Collection lists (`useLeaguesList`, `useTeamsList`)
- One-off mutations (`useUpdateGame`, `useUpdateTournament`)

Mutations do not need `invalidateSelectedLeague` — that query no longer exists.
List screens still call `invalidateLeaguesList` after league create/update/delete.
