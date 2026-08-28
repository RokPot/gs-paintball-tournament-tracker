# RxDB Observables Implementation Status

## Overview

RxDB is the app's local database. PouchDB has been removed. Active league/tournament/game
selection lives in the `activeState` singleton and is consumed through observable hooks.

## What Was Implemented

### Completed

1. **RxDB storage layer**
   - Schemas, Dexie storage, `RxDBProvider`
   - `*ServiceRxDB` for leagues, tournaments, games, teams, leaderboard teams, active state
   - Stages/groups are embedded on tournament documents (no `StageQueries`)

2. **Active state**
   - Singleton `_id: "active-state"` initialized on database create
   - One-time seed from legacy `isLeagueSelected` during league schema 0 → 1 migration
   - Writes go through `ActiveStateServiceRxDB` from `useLeagueFlows` and match start

3. **Observable hooks**
   - `useActiveStateObservable()`
   - `useTournamentObservable(tournamentId)`
   - `useLeagueObservable(leagueId)`
   - `useGameObservable(gameId)`
   - `usePopulatedActiveState()` — used by `TournamentContext`

4. **Leaderboard**
   - `leaderboardTeams` collection
   - Populated on league read; persisted on league write

5. **App wiring**
   - `TournamentContext` reads populated active state (not React Query `useActiveLeague`)
   - League list Active badge compares `league._id` to `activeState.leagueId`
   - Results window stays DB-free (IPC snapshot only)
   - Dev-only `ActiveStateDebugPanel` on HomePage

## Architecture

```
RxDBProvider
  TournamentProvider
    usePopulatedActiveState()
      -> activeLeague / activeTournament
    useTournamentLogic(activeLeague)
```

Game and tournament document writes update subscribers automatically. Prefer observables
for local documents; keep React Query for list fetches that are not in the active-state path
(`useLeaguesList`, `useTeamsList`).

## Current Status

**Last Updated**: 2026-08-26
**Status**: Migration complete

`isLeagueSelected` and `useActiveLeague` / `getActiveLeague` have been removed.

## Files Reference

- `src/hooks/observables/` — observable hooks + this status doc
- `src/services/ActiveStateServiceRxDB.tsx`
- `src/services/rxdb/database.ts`
- `src/store/TournamentContext.tsx`
- `src/store/RxDBContext.tsx`
- `src/components/dev/ActiveStateDebugPanel.tsx`
