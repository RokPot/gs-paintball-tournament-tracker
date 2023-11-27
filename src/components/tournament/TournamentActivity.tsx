import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import TeamsShortList from 'components/teams/TeamShortList';
import League from 'types/League';
import TournamentDetailsList from './TournamentDetailsList';

interface IProps {
  activeLeague: League;
}

const TournamentActivity = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;

  if (!selectedTournament || !activeLeague) {
    return null;
  }

  return (
    <FlexContainer flexDirection="column">
      <TournamentDetailsList tournament={selectedTournament} />
      <FlexContainer flexDirection="row" width="100%">
        <FlexContainer
          flexDirection="column"
          width="100%"
          alignItems="flex-start"
          justifyContent="flex-start"
          height="100%"
        >
          <Typography variant="h5">Participating teams</Typography>
          <TeamsShortList teams={selectedTournament.teams} />
        </FlexContainer>
        <FlexContainer
          flexDirection="column"
          width="100%"
          alignItems="flex-start"
          justifyContent="flex-start"
          height="100%"
        >
          <Typography variant="h5">Tournament leaderboard</Typography>

          <LeaderboardList teams={selectedTournament.leaderboard} />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default TournamentActivity;
