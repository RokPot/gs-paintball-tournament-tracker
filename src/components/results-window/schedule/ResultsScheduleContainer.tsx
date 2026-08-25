import { Typography } from '@mui/material';
import EmptyInboxIcon from 'assets/icons/EmptyInbox';
import FlexContainer from 'components/shared/FlexContainer';
import useGetScheduleRows from 'hooks/ui/useGetScheduleRows';
import { useCallback } from 'react';
import { GameState } from 'types/GameState';
import Tournament from 'types/Tournament';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import ResultsScheduleRowGame from './ScheduleRowGame';
import ScheduleRowGroup, { StyledDivider } from './ScheduleRowGroup';

interface IProps {
  activeTournament?: Tournament;
  hideFinishedGames?: boolean;
  activeGameId?: string;
}

const ResultsScheduleContainer = ({
  activeTournament,
  hideFinishedGames,
  activeGameId,
}: IProps) => {
  const filterScheduledGame = useCallback(
    (scheduledGame: TournamentScheduleGame) =>
      scheduledGame.game.gameState !== GameState.finished,
    [],
  );

  const { scheduleRows } = useGetScheduleRows(
    activeTournament?.currentStage,
    activeTournament?.settings,
    hideFinishedGames ? filterScheduledGame : undefined,
  );

  if (!activeTournament) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyInboxIcon fill="transparent" width="250px" />

        <Typography variant="h3">No active tournament.</Typography>
      </FlexContainer>
    );
  }

  if (!scheduleRows?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyInboxIcon />

        <Typography variant="h3">
          {hideFinishedGames ? 'No games left to play.' : 'No schedule.'}
        </Typography>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      justifyContent="flex-start"
      alignItems="flex-start"
      gap={0}
      style={{
        paddingTop: '8px',
      }}
      position="relative"
    >
      {scheduleRows?.map((scheduleRow, index) => {
        if (scheduleRow.showDivider) {
          return <StyledDivider key={`${index}1`} />;
        }
        if (scheduleRow.showGroup) {
          return (
            <ScheduleRowGroup
              key={`${index}1`}
              groupIndex={scheduleRow.groupIndex || index}
            />
          );
        }

        return (
          <ResultsScheduleRowGame
            key={`${index}1`}
            game={scheduleRow.scheduledGame?.game!}
            gameNumber={scheduleRow?.scheduledGame?.gameNumber || index}
            isActive={scheduleRow.scheduledGame?.id === activeGameId}
          />
        );
      })}
    </FlexContainer>
  );
};

export default ResultsScheduleContainer;
