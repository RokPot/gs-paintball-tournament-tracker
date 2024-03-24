import { LoadingButton } from '@mui/lab';
import CustomModal from 'components/shared/CustomModal';
import CustomTabs from 'components/shared/CustomTabs';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import TournamentTypesPreview from 'components/tournament/visualizations/TournamentTypesPreview';
import { useCallback, useEffect, useState } from 'react';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import TournamentStage from 'types/TournamentStage';
import { TournamentStatus } from 'types/TournamentStatus';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';
import { generateNextTournamentStage } from 'utils/tournamentUtils';

interface IProps {
  tournament?: Tournament;
  onTournamentContinueStage: (nextStage: TournamentStage) => Promise<void>;
}

const StageChangeTournamentModal: React.FC<IProps> = ({
  tournament,
  onTournamentContinueStage,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([]);
  const [nextStage, setNextStage] = useState<TournamentStage>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const calculateLeaderboard = useCallback(
    (group?: TournamentGroup) => {
      if (!tournament || !group) {
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

  const onProceedToNextStageClick = useCallback(async () => {
    if (!nextStage) {
      return;
    }
    try {
      await onTournamentContinueStage(nextStage);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  }, [nextStage, onTournamentContinueStage]);

  const generateNextStageGames = useCallback(() => {
    if (!tournament) {
      return;
    }
    const newStage = generateNextTournamentStage(
      tournament,
      tournament.settings.secondStageType,
    );
    setNextStage(newStage);
  }, [tournament]);

  useEffect(() => {
    if (
      !tournament?.state?.status ||
      tournament?.state?.status !== TournamentStatus.stageChange
    ) {
      return;
    }
    setIsModalOpen(true);
    calculateLeaderboard(tournament?.previousStage?.groups[0]);

    generateNextStageGames();
  }, [
    calculateLeaderboard,
    generateNextStageGames,
    tournament?.previousStage?.groups,
    tournament?.state.isTournamentFinished,
    tournament?.state?.status,
  ]);

  console.log(nextStage);
  return (
    <CustomModal
      isModalOpen={isModalOpen}
      width={1200}
      onClose={() => setIsModalOpen(false)}
      showHeader
      fullScreen
      title="Tournament has finished stage"
    >
      <FlexContainer
        padding="16px"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        gap={16}
        position="relative"
      >
        {tournament?.previousStage &&
          tournament?.previousStage.groups?.length! > 1 && (
            <CustomTabs
              items={
                tournament?.previousStage.groups
                  ?.filter(
                    (group) =>
                      (tournament.state.stage === 1 && group.stage === 1) ||
                      group.stage === tournament.state.stage - 1,
                  )
                  .map((group) => ({
                    label: `Group ${group.groupIndex}`,
                    value: group.id,
                  })) || []
              }
              onTabChanged={(newTabGroupId) => {
                calculateLeaderboard(
                  tournament?.previousStage?.groups?.find(
                    (group) => group.id === newTabGroupId,
                  )!,
                );
              }}
            />
          )}
        <LeaderboardList teams={leaderboard} />
        <TournamentTypesPreview group={nextStage?.groups[0]} />

        <LoadingButton
          variant="contained"
          onClick={onProceedToNextStageClick}
          style={{ position: 'sticky', bottom: '16px', marginLeft: 'auto' }}
        >
          Proceed to next Stage
        </LoadingButton>
      </FlexContainer>
    </CustomModal>
  );
};

export default StageChangeTournamentModal;
