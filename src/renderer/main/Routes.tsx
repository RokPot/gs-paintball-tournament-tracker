const routes = {
  LEAGUES: '/leagues',
  TEAMS: '/teams',
  TOURNAMENT: '/tournament/:leagueId?',
  SCOREBOARD: '/scoreboard',
  HOME: '/',
  getTournamentWithLeagueRoute: (leagueId: string) => `/tournament/${leagueId}`,
  getTournamentRoute: () => `/tournament`,
};
export default routes;
