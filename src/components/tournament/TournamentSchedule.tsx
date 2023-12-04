import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import TeamsShortList from 'components/teams/TeamShortList';
import League from 'types/League';
import { ReactComponent as EmptyState } from '../../../assets/icons/EmptyInbox.svg';
import TournamentDetailsList from './TournamentDetailsList';

interface IProps {
  activeLeague: League;
}

const TournamentSchedule = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;

  if (!selectedTournament?.groups?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyState />
        <Typography variant="h3">
          Tournament has not yet been initialized.
        </Typography>
      </FlexContainer>
    );
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

export default TournamentSchedule;
