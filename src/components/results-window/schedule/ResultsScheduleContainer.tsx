import { Typography } from '@mui/material';
import EmptyInboxIcon from 'assets/icons/EmptyInbox';
import FlexContainer from 'components/shared/FlexContainer';
import useGetScheduleRows from 'hooks/ui/useGetScheduleRows';
import Tournament from 'types/Tournament';
import ScheduleRowGame from './ScheduleRowGame';
import ScheduleRowGroup, { StyledDivider } from './ScheduleRowGroup';

interface IProps {
  activeTournament?: Tournament;
}

const ResultsScheduleContainer = ({ activeTournament }: IProps) => {
  const { scheduleRows } = useGetScheduleRows(
    activeTournament?.currentStage,
    activeTournament?.settings,
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

        <Typography variant="h3">No schedule.</Typography>
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
          <ScheduleRowGame
            key={`${index}1`}
            game={scheduleRow.scheduledGame?.game!}
            gameNumber={scheduleRow?.scheduledGame?.gameNumber || index}
          />
        );
      })}
    </FlexContainer>
  );
};

export default ResultsScheduleContainer;
