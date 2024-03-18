import { Button, Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { useNavigate } from 'react-router-dom';
import routes from 'renderer/main/Routes';
import { TournamentStatus } from 'types/TournamentStatus';

interface IProps {
  onTournamentStart: () => void;
  tournamentSelected?: boolean;
  status?: TournamentStatus;
}

const StartTournament: React.FC<IProps> = ({
  onTournamentStart,
  tournamentSelected,
  status,
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
      {status === TournamentStatus.created && (
        <Typography variant="h4Medium">
          Tournament not initialized yet
        </Typography>
      )}
      {status !== TournamentStatus.created && (
        <Typography variant="h4Medium">
          {tournamentSelected
            ? 'Tournament has not started yet'
            : 'No tournament selected'}
        </Typography>
      )}

      {tournamentSelected && (
        <>
          <Typography variant="subtitle1">
            {status === TournamentStatus.created
              ? 'Please initialize the tournament.'
              : 'Please start the tournament.'}
          </Typography>
          <FlexContainer flexDirection="row" gap={8}>
            <Button
              onClick={() => navigate(routes.getTournamentRoute())}
              variant="outlined"
            >
              <Typography variant="p1Medium">Go to Tournaments</Typography>
            </Button>
            {status !== TournamentStatus.created && (
              <Button onClick={onTournamentStart} variant="contained">
                <Typography variant="p1Medium">Start Tournament</Typography>
              </Button>
            )}
          </FlexContainer>
        </>
      )}
      {!tournamentSelected && (
        <>
          <Typography variant="subtitle1">
            Please select existing tournament or create a new one.
          </Typography>
          <Button onClick={() => navigate(routes.getTournamentRoute())}>
            <Typography variant="p1Medium">Go to Tournaments</Typography>
          </Button>
        </>
      )}
    </FlexContainer>
  );
};

export default StartTournament;
