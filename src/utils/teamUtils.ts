import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';
import { v4 } from 'uuid';

export const sortTeamsByCreatedAt = (teams: Team[]) =>
  [...teams].sort((a, b) => {
    const aTime = a.createdAt?.valueOf() ?? 0;
    const bTime = b.createdAt?.valueOf() ?? 0;
    return aTime - bTime;
  });

export const createNewLeaderboardTeam = (team: Team) => {
  const id = v4();
  return new LeaderboardTeam({
    _id: id,
    id,
    team,
    rank: 0,
    totalLosses: 0,
    totalPoints: 0,
    totalWins: 0,
    previousRank: 0,
    totalDraws: 0,
  });
};

export const createNewTeam = (team: Team) => {
  return new Team({
    ...team,
  });
};
