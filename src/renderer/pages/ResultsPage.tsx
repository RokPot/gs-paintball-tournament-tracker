import CurrentGameView from 'components/results-window/current-game-view/CurrentGameView';
import LeaderboardView from 'components/results-window/LeaderboardView';
import OnDeckBar from 'components/results-window/OnDeckBar';
import RotatingPanel from 'components/results-window/RotatingPanel';
import ResultsScheduleView from 'components/results-window/schedule/ResultsScheduleView';
import FlexContainer from 'components/shared/FlexContainer';
import TournamentTypesPreview from 'components/tournament/visualizations/TournamentTypesPreview';
import useResultsSnapshot from 'hooks/results/useResultsSnapshot';
import useResultsWindowGames from 'hooks/results/useResultsWindowGames';
import { RotatingPanelItem } from 'hooks/ui/useRotatingPanel';
import { useMemo } from 'react';
import { TournamentTypeEnum } from 'types/TournamentType';

const SCHEDULE_PANEL_DURATION_IN_MS = 1000 * 30;
const SCHEDULE_SCROLL_DELAY_IN_MS = 1000 * 6;
const LEADERBOARD_PANEL_DURATION_IN_MS = 1000 * 15;
const BRACKET_PANEL_DURATION_IN_MS = 1000 * 20;

const ResultsPage: React.FC = () => {
  const activeLeague = useResultsSnapshot();

  const currentStage = useMemo(
    () => activeLeague?.activeTournament?.currentStage,
    [activeLeague],
  );

  const { activeGame, onDeckGames, upcomingGames } =
    useResultsWindowGames(activeLeague);

  const isSingleElimination =
    currentStage?.stageGamesType.type === TournamentTypeEnum.singleElimination;

  const hasLeaderboard =
    !!activeLeague?.activeTournament?.currentStageGroups?.length &&
    !isSingleElimination;

  const panels: RotatingPanelItem[] = useMemo(
    () => [
      {
        key: 'schedule',
        title: 'Upcoming games',
        durationInMs: SCHEDULE_PANEL_DURATION_IN_MS,
        scrollDelayInMs: SCHEDULE_SCROLL_DELAY_IN_MS,
        enabled: !isSingleElimination && upcomingGames.length > 0,
        node: (
          <ResultsScheduleView
            activeLeague={activeLeague}
            hideFinishedGames
            activeGameId={activeGame?.id}
          />
        ),
      },
      {
        key: 'bracket',
        title: 'Bracket',
        durationInMs: BRACKET_PANEL_DURATION_IN_MS,
        enabled: isSingleElimination,
        node: (
          <TournamentTypesPreview
            group={activeLeague?.activeTournament?.currentStageGroups?.[0]}
          />
        ),
      },
      {
        key: 'standings',
        title: 'Standings',
        durationInMs: LEADERBOARD_PANEL_DURATION_IN_MS,
        enabled: hasLeaderboard,
        node: <LeaderboardView activeLeague={activeLeague} />,
      },
    ],
    [
      activeLeague,
      activeGame?.id,
      upcomingGames.length,
      isSingleElimination,
      hasLeaderboard,
    ],
  );

  return (
    <FlexContainer
      flexDirection="column"
      height="100vh"
      width="100%"
      alignItems="flex-start"
      style={{ overflow: 'hidden' }}
    >
      <FlexContainer
        flexDirection="column"
        width="100%"
        alignItems="center"
        style={{ flex: '0 0 auto' }}
      >
        <CurrentGameView activeGame={activeGame} />
        <OnDeckBar onDeckGames={onDeckGames} />
      </FlexContainer>

      <FlexContainer
        width="100%"
        height="100%"
        alignItems="flex-start"
        style={{ flex: 1, minHeight: 0 }}
      >
        <RotatingPanel panels={panels} />
      </FlexContainer>
    </FlexContainer>
  );
};

export default ResultsPage;
