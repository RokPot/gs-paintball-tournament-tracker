import usePouchDB, { DocType, pouchDbName } from './pouchDB';
import { useCallback } from 'react';
import { Tournament } from 'types/Tournament';
import { TournamentDto } from 'types/dto/TournamentDto';
import { getRootElementAndLinkedDocs } from 'utils/PouchDBUtils';

const useTournamentService = () => {
  const db = usePouchDB(pouchDbName);

  const addNewTournament = useCallback(async (tournament: TournamentDto) => {
    try {
      const res = await db.post(tournament);
    } catch {}
  }, []);
  const updateTournament = useCallback(async (tournament: TournamentDto) => {
    const res = await db.post(tournament);
  }, []);
  const deleteTournament = useCallback(async (tournament: TournamentDto) => {
    // await db.remove(tournament._id);
  }, []);
  const getTournament = useCallback((tournament: TournamentDto) => {
    return db.get(tournament._id);
  }, []);
  const getTournaments = useCallback(async () => {
    const myMapFunction = (doc: any, emit: any) => {
      if (doc.docType === DocType.Tournament) {
        emit(doc, DocType.Tournament);
      }
    };
    const result = await db.query<TournamentDto[]>(myMapFunction, {
      include_docs: true,
    });
    const { rootDoc } = getRootElementAndLinkedDocs<TournamentDto>(
      result.rows,
      DocType.Tournament
    );
    if (!rootDoc) {
      return;
    }
    const rootDocs = result.rows
      .filter(
        (res) => res.value === DocType.Tournament && res.doc !== undefined
      )
      .map((rows) => rows.doc as unknown as TournamentDto)
      .filter((row) => row !== undefined);
    return rootDocs.map((rootDoc) => new Tournament(rootDoc));
    // const tournaments: Tournament[] = [];
    // const groupedResults = groupBy(result.rows, (row) => row.id);
    // for (const key of Object.keys(groupedResults)) {
    //   const { rootDoc, otherDocs } = getRootElementAndLinkedDocs<LeagueDto>(
    //     groupedResults[key],
    //     'league'
    //   );

    //   const rootLeague = rootDoc;
    //   if (!rootLeague) {
    //     return;
    //   }
    //   const newLeague: League = new League(rootLeague);

    //   const teams = mapTeamsFromResponse(
    //     rootLeague?.teamIds,
    //     otherDocs.filter((val) => val.value.type === 'team')
    //   );
    //   const leaderboardTeams = mapLeaderboardTeamsFromResponse(
    //     rootLeague?.leaderboardTeamIds,
    //     teams,
    //     otherDocs.filter((val) => val.value.type === 'leaderboard')
    //   );
    //   const tournaments = mapTournamentsFromResponse(
    //     rootLeague?.leaderboardTeamIds,
    //     teams,
    //     otherDocs.filter((val) => val.value.type === 'tournament')
    //   );
    //   newLeague.teams = teams;
    //   newLeague.leaderboard = leaderboardTeams;
    //   newLeague.tournaments = tournaments;
    //   leagues.push(newLeague);
    // }
    // return leagues;
  }, []);

  return {
    addNewTournament,
    updateTournament,
    deleteTournament,
    getTournament,
    getTournaments,
  };
};

export default useTournamentService;
