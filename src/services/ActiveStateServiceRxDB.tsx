import { useCallback } from 'react';
import { useRxDB } from 'store/RxDBContext';
import { IActiveState } from 'types/interfaces/IActiveState';

/**
 * ActiveStateService using RxDB
 *
 * This service manages a singleton active state row that tracks:
 * - Selected League (leagueId)
 * - Selected Tournament (tournamentId)
 * - Current Active Game (gameId)
 *
 * The collection always has exactly one row with _id: "active-state"
 *
 * Usage:
 * const { getActiveState, setActiveLeague, setActiveTournament, setActiveGame } = useActiveStateServiceRxDB();
 */
const useActiveStateServiceRxDB = () => {
  const { database } = useRxDB();

  // Singleton ID - always use this for the active state document
  const ACTIVE_STATE_ID = 'active-state';

  /**
   * Initialize the active state document if it doesn't exist
   * This should be called on app startup to ensure the row exists
   */
  const initializeActiveState = useCallback(async () => {
    if (!database) {
      throw new Error('RxDB database not initialized');
    }

    try {
      // Check if active state already exists
      const existing = await database.collections.activeState
        .findOne({ selector: { _id: ACTIVE_STATE_ID } })
        .exec();

      if (!existing) {
        // Create initial active state with all null values
        await database.collections.activeState.insert({
          _id: ACTIVE_STATE_ID,
          gameId: null,
          tournamentId: null,
          leagueId: null,
        });
      }
    } catch (error: any) {
      throw new Error(`Failed to initialize active state: ${error.message}`);
    }
  }, [database]);

  /**
   * Get the current active state
   */
  const getActiveState = useCallback(async (): Promise<IActiveState | null> => {
    if (!database) {
      throw new Error('RxDB database not initialized');
    }

    try {
      const activeStateDoc = await database.collections.activeState
        .findOne({ selector: { _id: ACTIVE_STATE_ID } })
        .exec();

      if (!activeStateDoc) {
        // If it doesn't exist, initialize it
        await initializeActiveState();
        const newDoc = await database.collections.activeState
          .findOne({ selector: { _id: ACTIVE_STATE_ID } })
          .exec();
        return newDoc ? newDoc.toMutableJSON() : null;
      }

      return activeStateDoc.toMutableJSON();
    } catch (error: any) {
      throw new Error(`Failed to get active state: ${error.message}`);
    }
  }, [database, initializeActiveState]);

  /**
   * Update the active state (partial update)
   */
  const updateActiveState = useCallback(
    async (
      updates: Partial<
        Pick<IActiveState, 'gameId' | 'tournamentId' | 'leagueId'>
      >,
    ) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      try {
        let activeStateDoc = await database.collections.activeState
          .findOne({ selector: { _id: ACTIVE_STATE_ID } })
          .exec();

        if (!activeStateDoc) {
          // Initialize if it doesn't exist
          await initializeActiveState();
          activeStateDoc = await database.collections.activeState
            .findOne({ selector: { _id: ACTIVE_STATE_ID } })
            .exec();
        }

        if (!activeStateDoc) {
          throw new Error('Failed to initialize active state');
        }

        // Update using incrementalModify
        await activeStateDoc.incrementalModify((oldData) => ({
          ...oldData,
          ...updates,
        }));

        return activeStateDoc.toMutableJSON();
      } catch (error: any) {
        throw new Error(`Failed to update active state: ${error.message}`);
      }
    },
    [database, initializeActiveState],
  );

  /**
   * Set the active league
   */
  const setActiveLeague = useCallback(
    async (leagueId: string | null) => {
      return updateActiveState({ leagueId });
    },
    [updateActiveState],
  );

  /**
   * Set the active tournament
   */
  const setActiveTournament = useCallback(
    async (tournamentId: string | null) => {
      return updateActiveState({ tournamentId });
    },
    [updateActiveState],
  );

  /**
   * Set the active game
   */
  const setActiveGame = useCallback(
    async (gameId: string | null) => {
      return updateActiveState({ gameId });
    },
    [updateActiveState],
  );

  /**
   * Set multiple active state values at once
   */
  const setActiveState = useCallback(
    async (
      state: Partial<
        Pick<IActiveState, 'gameId' | 'tournamentId' | 'leagueId'>
      >,
    ) => {
      return updateActiveState(state);
    },
    [updateActiveState],
  );

  return {
    getActiveState,
    updateActiveState,
    setActiveLeague,
    setActiveTournament,
    setActiveGame,
    setActiveState,
    initializeActiveState,
  };
};

export default useActiveStateServiceRxDB;
