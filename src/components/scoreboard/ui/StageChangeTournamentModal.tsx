import CustomModal from 'components/shared/CustomModal';
import CustomTabs from 'components/shared/CustomTabs';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useCallback, useEffect, useState } from 'react';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentStatus } from 'types/TournamentStatus';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';

interface IProps {
  tournament?: Tournament;
  onTournamentContinueStage: () => void;
}

const StageChangeTournamentModal: React.FC<IProps> = ({ tournament }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      tournament?.state?.status !== TournamentStatus.stageChange
    ) {
      return;
    }
    setIsModalOpen(true);
    calculateLeaderboard(tournament?.groups[0]);
  }, [
    calculateLeaderboard,
    tournament?.groups,
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
        {tournament?.groups?.length! > 1 && (
          <CustomTabs
            items={
              tournament?.groups?.map((group) => ({
                label: `Group ${group.groupIndex}`,
                value: group.id,
              })) || []
            }
            onTabChanged={(newTabGroupId) => {
              calculateLeaderboard(
                tournament?.groups?.find(
                  (group) => group.id === newTabGroupId,
                )!,
              );
            }}
          />
        )}
        <LeaderboardList teams={leaderboard} />
      </FlexContainer>
    </CustomModal>
  );
};

export default StageChangeTournamentModal;
