import { Button, Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';

interface IProps {
  onTournamentStart: () => void;
}

const StartTournament: React.FC<IProps> = ({ onTournamentStart }) => {
  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={16}
    >
      <Typography variant="h4Medium">
        Tournament has not started yet. Start the tournament.
      </Typography>
      <Button onClick={onTournamentStart}>
        <Typography variant="p1Medium">Start Tournament</Typography>
      </Button>
    </FlexContainer>
  );
};

export default StartTournament;
