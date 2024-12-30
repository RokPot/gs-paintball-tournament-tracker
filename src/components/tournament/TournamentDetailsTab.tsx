import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import usePdfExporter from 'hooks/exporter/usePdfExporter';
import { useContext, useMemo } from 'react';
import { TournamentContext } from 'store/TournamentContext';
import { calculateTournamentLeaderboard } from 'utils/tournamentResultUtils';
import TournamentDetailsList from './TournamentDetailsList';

const TournamentDetailsTab = () => {
  const { activeTournament, activeLeague } = useContext(TournamentContext);
  const { exportTournamentRules } = usePdfExporter();
  const theme = useTheme();

  const tournamentLeaderboard = useMemo(() => {
    return calculateTournamentLeaderboard(activeTournament);
  }, [activeTournament]);

  if (!activeTournament || !activeLeague) {
    return null;
  }

  return (
    <FlexContainer
      flexDirection="column"
      style={{ flexGrow: 1 }}
      overflowY="auto"
      position="relative"
    >
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        style={{
          position: 'absolute',
          right: '8px',
          top: '0px',
          zIndex: 2,
        }}
      >
        <Tooltip title="Export Rules" arrow>
          <IconButton onClick={() => exportTournamentRules(activeTournament)}>
            <FontAwesomeIcon
              icon={faFileExport}
              width={15}
              height={15}
              color={theme.palette.primary.main}
            />
          </IconButton>
        </Tooltip>
      </FlexContainer>
      <TournamentDetailsList tournament={activeTournament} />

      <Typography variant="h5">Tournament leaderboard</Typography>

      <LeaderboardList teams={tournamentLeaderboard} />
    </FlexContainer>
  );
};

export default TournamentDetailsTab;
