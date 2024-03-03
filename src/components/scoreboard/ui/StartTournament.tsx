import { Button, Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { useNavigate } from 'react-router-dom';

interface IProps {
  onTournamentStart: () => void;
  tournamentSelected?: boolean;
}

const StartTournament: React.FC<IProps> = ({
  onTournamentStart,
  tournamentSelected,
}) => {
  const navigate = useNavigate();
  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={16}
    >
      <Typography variant="h4Medium">
        {tournamentSelected
          ? 'Tournament has not started yet'
          : 'No tournament selected'}
      </Typography>

      {tournamentSelected && (
        <>
          <Typography variant="subtitle1">
            Please start the tournament.
          </Typography>
          <FlexContainer flexDirection="row">
            <Button onClick={() => navigate('/tournament')}>
              <Typography variant="p1Medium">Go to Tournaments</Typography>
            </Button>
            <Button onClick={onTournamentStart} variant="contained">
              <Typography variant="p1Medium">Start Tournament</Typography>
            </Button>
          </FlexContainer>
        </>
      )}
      {!tournamentSelected && (
        <>
          <Typography variant="subtitle1">
            Please select existing tournament or create a new one.
          </Typography>
          <Button onClick={() => navigate('/tournament')}>
            <Typography variant="p1Medium">Go to Tournaments</Typography>
          </Button>
        </>
      )}
    </FlexContainer>
  );
};

export default StartTournament;
