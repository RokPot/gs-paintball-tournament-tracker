import { Button, Typography } from '@mui/material';
import CustomModal from 'components/shared/CustomModal';
import CustomTabs from 'components/shared/CustomTabs';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from 'renderer/main/Routes';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentStatus } from 'types/TournamentStatus';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';

interface IProps {
  tournament?: Tournament;
  onTournamentContinueStage: () => void;
}

const FinishedTournamentModal: React.FC<IProps> = ({ tournament }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const calculateLeaderboard = useCallback(
    (group: TournamentGroup) => {
      if (!tournament) {
        return;
      }
      const newLeaderboard = calculateTournamentGroupLeaderboard(
        group,
        tournament.settings,
      );

      setLeaderboard(newLeaderboard);
    },
    [tournament],
  );

  useEffect(() => {
    if (
      !tournament?.state?.status ||
      tournament?.state?.status !== TournamentStatus.finished
    ) {
      return;
    }
    setIsModalOpen(true);
    if (!tournament.currentStage) {
      return;
    }
    calculateLeaderboard(tournament.currentStage.groups[0]);
  }, [
    calculateLeaderboard,
    tournament?.currentStage,
    tournament?.state.isTournamentFinished,
    tournament?.state?.status,
  ]);

  return (
    <CustomModal
      isModalOpen={isModalOpen}
      width={1000}
      onClose={() => setIsModalOpen(false)}
      showHeader
      title="Tournament has finished"
    >
      <FlexContainer
        padding="16px"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={16}
      >
        {tournament?.currentStage &&
          tournament?.currentStage?.groups?.length > 1 && (
            <CustomTabs
              items={
                tournament?.currentStage?.groups?.map((group) => ({
                  label: `Group ${group.groupIndex}`,
                  value: group.id,
                })) || []
              }
              onTabChanged={(newTabGroupId) => {
                const selectedGroup = tournament?.currentStage?.groups?.find(
                  (group) => group.id === newTabGroupId,
                );
                if (!selectedGroup || !tournament?.currentStage) {
                  return;
                }
                calculateLeaderboard(selectedGroup);
              }}
            />
          )}
        <LeaderboardList teams={leaderboard} />
        <Button onClick={() => navigate(routes.getTournamentRoute())}>
          <Typography variant="p1Medium">Go to Tournaments</Typography>
        </Button>
      </FlexContainer>
    </CustomModal>
  );
};

export default FinishedTournamentModal;
