import { LoadingButton } from '@mui/lab';
import CustomModal from 'components/shared/CustomModal';
import CustomTabs from 'components/shared/CustomTabs';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import TournamentTypesPreview from 'components/tournament/visualizations/TournamentTypesPreview';
import { useCallback, useEffect, useState } from 'react';
import Game from 'types/Game';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentGroupSettings } from 'types/TournamentGroupSettings';
import { TournamentStatus } from 'types/TournamentStatus';
import { TournamentType } from 'types/TournamentType';
import { shuffleArray } from 'utils/arrayUtils';
import { generateGamesForRoundRobin } from 'utils/tournament/roundRobinUtils';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';
import { generateGamesForEliminationBrackets } from 'utils/tournamentUtils';

interface IProps {
  tournament?: Tournament;
  onTournamentContinueStage: (group: TournamentGroup) => Promise<void>;
}

const StageChangeTournamentModal: React.FC<IProps> = ({
  tournament,
  onTournamentContinueStage,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([]);
  const [nextStageGroup, setNextStageGroup] = useState<TournamentGroup>();
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

  const onProceedToNextStageClick = useCallback(async () => {
    if (!nextStageGroup) {
      return;
    }
    await onTournamentContinueStage(nextStageGroup);
  }, [nextStageGroup, onTournamentContinueStage]);

  const generateNextStageGames = useCallback(() => {
    const numberOfTopTeamsToProceedToNextStage = 2;
    if (!tournament) {
      return;
    }
    const previousStageGroups = tournament?.groups?.filter(
      (group) => group.stage === (tournament.state.stage - 1 || 1),
    );
    const previousStageGroupWinners: { groupIndex: number; teams: Team[] }[] =
      [];
    previousStageGroups.forEach((previousStageGroup) => {
      const groupLeaderboard = calculateTournamentGroupLeaderboard(
        previousStageGroup,
        tournament.settings,
      );
      if (!groupLeaderboard?.length) {
        return;
      }
      previousStageGroupWinners.push({
        groupIndex: previousStageGroup.groupIndex,
        teams: groupLeaderboard
          .slice(0, numberOfTopTeamsToProceedToNextStage)
          .map((leaderboardTeam) => leaderboardTeam.team),
      });
    });
    const nextStageTeams: Team[] = [];
    const nextStageGames: Game[] = [];
    const groupSettings: TournamentGroupSettings = {
      bracketNumberOfRounds: 0,
    };

    for (let i = 0; i < tournament.settings.numberOfGroups; i += 1) {
      nextStageTeams.push(...previousStageGroupWinners[i].teams);
    }

    if (tournament.settings.secondStageType === TournamentType.roundRobin) {
      const { games: roundRobinGames } = generateGamesForRoundRobin(
        shuffleArray(nextStageTeams),
        tournament.gameSettings,
      );
      nextStageGames.push(...roundRobinGames);
    }
    if (
      tournament.settings.secondStageType === TournamentType.singleElimination
    ) {
      const seededTeamsGrouped: Team[][] = [];
      for (let i = 0; i < numberOfTopTeamsToProceedToNextStage; i += 1) {
        const seedTeams: Team[] = [];
        for (let j = 0; j < tournament.settings.numberOfGroups; j += 1) {
          const seedTeam =
            nextStageTeams[i + j * numberOfTopTeamsToProceedToNextStage];
          if (seedTeam) {
            seedTeams.push(seedTeam);
          }
        }
        if (tournament.settings.numberOfGroups > 2) {
          seedTeams.reverse();
        }
        seededTeamsGrouped.push(seedTeams);
      }
      const seededShuffeledTeams = seededTeamsGrouped.flat(1);

      const {
        games: bracketGames,
        totalNumberOfRounds: numberOfBracketRounds,
      } = generateGamesForEliminationBrackets(
        seededShuffeledTeams,
        tournament.gameSettings,
      );
      nextStageGames.push(...bracketGames);
      groupSettings.bracketNumberOfRounds = numberOfBracketRounds;
    }
    if (
      tournament.settings.secondStageType === TournamentType.doubleElimination
    ) {
      const {
        games: bracketGames,
        totalNumberOfRounds: totalNumberOfBracketRounds,
      } = generateGamesForEliminationBrackets(
        nextStageTeams,
        tournament.gameSettings,
      );
      nextStageGames.push(...bracketGames);
      groupSettings.bracketNumberOfRounds = totalNumberOfBracketRounds;
    }
    const currentStageGroup = tournament.groups.find(
      (group) => group.stage === tournament.state.stage,
    );
    if (!currentStageGroup) {
      return;
    }
    currentStageGroup.games = nextStageGames;
    currentStageGroup.teams = nextStageTeams;
    currentStageGroup.settings = groupSettings;
    setNextStageGroup(currentStageGroup);
  }, [tournament]);

  useEffect(() => {
    if (
      !tournament?.state?.status ||
      tournament?.state?.status !== TournamentStatus.stageChange
    ) {
      return;
    }
    setIsModalOpen(true);
    calculateLeaderboard(tournament?.groups[0]);

    generateNextStageGames();
  }, [
    calculateLeaderboard,
    generateNextStageGames,
    tournament?.groups,
    tournament?.state.isTournamentFinished,
    tournament?.state?.status,
  ]);
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
        {tournament?.groups?.length! > 1 && (
          <CustomTabs
            items={
              tournament?.groups
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
                tournament?.groups?.find(
                  (group) => group.id === newTabGroupId,
                )!,
              );
            }}
          />
        )}
        <LeaderboardList teams={leaderboard} />
        <TournamentTypesPreview group={nextStageGroup} />

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
