import { Typography } from '@mui/material';
import EmptyInboxIcon from 'assets/icons/EmptyInbox';
import FlexContainer from 'components/shared/FlexContainer';
import { useContext } from 'react';
import { TournamentQueries } from 'services/queries/tournament/TournamentQueries';
import { TournamentContext } from 'store/TournamentContext';
import TournamentActivityRow from './tournament-page/TournamentActivityRow';

const TournamentActivityTab = () => {
  const { activeTournament } = useContext(TournamentContext);

  const { data: activityList, isFetching } =
    TournamentQueries.useTournamentActivityList(activeTournament?.id || '');

  if (!activeTournament?.stages?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyInboxIcon fill="transparent" width="250px" />
        <Typography variant="h3">
          Tournament has not yet been initialized.
        </Typography>
      </FlexContainer>
    );
  }

  if (!activityList?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyInboxIcon fill="transparent" width="250px" />
        <Typography variant="h3">
          There is currently no activity for this tournament.
        </Typography>
      </FlexContainer>
    );
  }
  return (
    <FlexContainer
      flexDirection="column"
      highlightRowOnHover
      padding="0px 20px"
      width="100%"
      loading={isFetching}
      overflowY="auto"
    >
      {activityList?.map((activity) => {
        const scheduledGame = activeTournament.stages
          ?.flatMap((stage) => stage.schedule)
          ?.find((schedGame) => schedGame.game.id === activity.game.id);
        return (
          <TournamentActivityRow
            key={activity.id}
            activity={activity}
            scheduledGame={scheduledGame}
          />
        );
      })}
    </FlexContainer>
  );
};

export default TournamentActivityTab;
