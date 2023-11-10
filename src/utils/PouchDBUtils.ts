import { LeaderboardTeam } from 'types/LeadeboardTeam';
import { Team } from 'types/Team';
import { LeaderboardTeamDto } from 'types/dto/LeaderboardTeamDto';
import { TeamDto } from 'types/dto/TeamDto';

interface PouchDBResponse<T> {
  id: any;
  key: any;
  value: any;
  doc?: PouchDB.Core.ExistingDocument<T & PouchDB.Core.AllDocsMeta> | undefined;
}

export const mapTeamsFromResponse = <T>(
  teamIds: string[],
  response: PouchDBResponse<T>[]
) => {
  const teamsList: Team[] = [];
  for (const teamId of teamIds || []) {
    const teamInResult = response.find((res) => res?.doc?._id === teamId)
      ?.doc as unknown as TeamDto;
    if (!teamInResult) {
      continue;
    }
    const teammm = new Team(teamInResult);
    teamsList.push(teammm);
  }
  return teamsList;
};

export const mapLeaderboardTeamsFromResponse = <T>(
  leaderboardTeamIds: string[],
  teams: Team[],
  response: PouchDBResponse<T>[]
) => {
  const teamsList: LeaderboardTeam[] = [];
  for (const teamId of leaderboardTeamIds || []) {
    const teamInResult = response.find((res) => res?.doc?._id === teamId)
      ?.doc as unknown as LeaderboardTeamDto;
    if (!teamInResult) {
      continue;
    }
    const teammm = new LeaderboardTeam({
      ...teamInResult,
      team: teams.find((team) => team._id === teamInResult.teamId)!,
    });
    teamsList.push(teammm);
  }
  return teamsList;
};

export const getRootElementAndLinkedDocs = <T>(
  docs: PouchDBResponse<T>[],
  wantedDocType: string
) => {
  const rootDoc = docs.find((res) => res.value === wantedDocType);
  if (!rootDoc?.doc) {
    return { rootDoc: null, otherDocs: docs };
  }
  const otherDocs = docs.filter((res) => res.value !== wantedDocType);
  return { rootDoc, otherDocs };
};
