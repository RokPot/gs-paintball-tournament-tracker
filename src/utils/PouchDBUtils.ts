import { groupBy } from 'lodash';
import { DocType } from 'services/pouchDB';
import LeaderboardTeam from 'types/LeadeboardTeam';
import League from 'types/League';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import { LeaderboardTeamDto } from 'types/dto/LeaderboardTeamDto';
import { LeagueDto } from 'types/dto/LeagueDto';
import { TeamDto } from 'types/dto/TeamDto';
import { TournamentDto } from 'types/dto/TournamentDto';

interface PouchDBResponse<T> {
  id: any;
  key: any;
  value: any;
  doc?: PouchDB.Core.ExistingDocument<T & PouchDB.Core.AllDocsMeta> | undefined;
}

export const mapTeamsFromResponse = <T>(
  teamIds: string[],
  response: PouchDBResponse<T>[],
) => {
  const teamsList: Team[] = [];
  teamIds.forEach((teamId) => {
    const teamInResult = response.find((res) => res?.doc?._id === teamId)
      ?.doc as unknown as TeamDto;
    if (!teamInResult) {
      return;
    }
    const teammm = new Team(teamInResult);
    teamsList.push(teammm);
  });
  return teamsList;
};

export const mapLeaderboardTeamsFromResponse = <T>(
  leaderboardTeamIds: string[],
  teams: Team[],
  response: PouchDBResponse<T>[],
) => {
  const teamsList: LeaderboardTeam[] = [];
  leaderboardTeamIds.forEach((teamId) => {
    const teamInResult = response.find((res) => res?.doc?._id === teamId)
      ?.doc as unknown as LeaderboardTeamDto;
    if (!teamInResult) {
      return;
    }
    const leaderboardTeamEntity = teams.find(
      (team) => team._id === teamInResult.teamId,
    );

    if (!leaderboardTeamEntity) {
      return;
    }
    const leaderboardTeam = new LeaderboardTeam({
      ...teamInResult,
      team: leaderboardTeamEntity,
    });
    teamsList.push(leaderboardTeam);
  });
  return teamsList;
};

export const mapTournamentsFromResponse = (
  leaderboardTeamIds: string[],
  teams: Team[],
  response: PouchDBResponse<unknown>[],
) => {
  const tournaments: Tournament[] = [];
  leaderboardTeamIds.forEach((teamId) => {
    const teamInResult = response.find((res) => res?.doc?._id === teamId)
      ?.doc as unknown as TournamentDto;
    if (!teamInResult) {
      return;
    }
    // todo rokpot fix this leaderboard [], get from response
    const newTournament = new Tournament({
      ...teamInResult,
      leaderboard: [],
      schedule: [],
    });
    tournaments.push(newTournament);
  });

  return tournaments;
};

export const getRootElementAndLinkedDocs = <T>(
  docs: PouchDBResponse<unknown>[],
  wantedDocType: DocType,
): { rootDoc?: T; otherDocs: PouchDBResponse<unknown>[] } => {
  const rootDoc = docs.find((res) => res.value === wantedDocType)?.doc as T;
  if (!rootDoc) {
    return { rootDoc: undefined, otherDocs: docs };
  }
  const otherDocs = docs.filter((res) => res.value !== wantedDocType);
  return { rootDoc, otherDocs };
};

export const getTournamentsList = (result: PouchDB.Query.Response<any>) => {
  const leagues: Tournament[] = [];
  const groupedResults = groupBy(result.rows, (row: any) => row.id);
  Object.keys(groupedResults).forEach((key) => {
    const { rootDoc, otherDocs } = getRootElementAndLinkedDocs<TournamentDto>(
      groupedResults[key],
      DocType.Tournament,
    );

    if (!rootDoc) {
      return;
    }
    const newTournament: Tournament = new Tournament(rootDoc);

    const teams = mapTeamsFromResponse(
      rootDoc?.teamIds,
      otherDocs.filter((val) => val.value.type === DocType.Team),
    );

    newTournament.teams = teams;

    leagues.push(newTournament);
  });
  return leagues;
};

export const getLeaguesList = (result: PouchDB.Query.Response<any>) => {
  const leagues: League[] = [];
  const groupedResults = groupBy(result.rows, (row: any) => row.id);
  Object.keys(groupedResults).forEach((key) => {
    const { rootDoc, otherDocs } = getRootElementAndLinkedDocs<LeagueDto>(
      groupedResults[key],
      DocType.League,
    );

    const rootLeague = rootDoc;
    if (!rootLeague) {
      return;
    }
    const newLeague: League = new League(rootLeague);

    const teams = mapTeamsFromResponse(
      rootLeague?.teamIds,
      otherDocs.filter((val) => val.value.type === DocType.Team),
    );
    const leaderboardTeams = mapLeaderboardTeamsFromResponse(
      rootLeague?.leaderboardTeamIds,
      teams,
      otherDocs.filter((val) => val.value.type === DocType.LeaderboardTeam),
    );
    const tournaments = mapTournamentsFromResponse(
      rootLeague?.tournamentIds,
      teams,
      otherDocs.filter((val) => val.value.type === DocType.Tournament),
    );
    newLeague.teams = teams;
    newLeague.leaderboard = leaderboardTeams;
    newLeague.tournaments = tournaments;
    if (rootLeague?.activeTournamentId) {
      newLeague.activeTournament = tournaments.find(
        (tournament) => tournament._id === rootLeague?.activeTournamentId,
      );
    }
    leagues.push(newLeague);
  });
  return leagues;
};
