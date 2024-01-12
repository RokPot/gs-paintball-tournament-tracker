import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { useState } from 'react';
import Game from 'types/Game';
import League from 'types/League';
import { ReactComponent as EmptyState } from '../../../assets/icons/EmptyInbox.svg';

interface IProps {
  activeLeague: League;
}

const TournamentSchedule = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;
  const [schedule, setSchedule] = useState<Game[]>([]);

  const generateSchedule = () => {
    if (!selectedTournament?.groups?.length) {
      return;
    }
    const { switchGames, switchGroups } = selectedTournament.settings;
    const totalGames = selectedTournament.groups.reduce((prev, curr) => {
      return prev + (curr?.games?.length || 0);
    }, 0);

    const currentGame = 0;
    const currentGroup = 1;
  };

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

  return <FlexContainer flexDirection="column">{}</FlexContainer>;
};

export default TournamentSchedule;
