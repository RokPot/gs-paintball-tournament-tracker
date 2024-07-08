import { Typography } from '@mui/material';
import EmptyInboxIcon from 'assets/icons/EmptyInbox';
import FlexContainer from 'components/shared/FlexContainer';
import { TournamentQueries } from 'services/queries/tournament/TournamentQueries';
import League from 'types/League';
import TournamentActivityRow from './tournament-page/TournamentActivityRow';

interface IProps {
  activeLeague: League;
}

const TournamentActivityTab = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;

  const { data: activityList, isFetching } =
    TournamentQueries.useTournamentActivityList(selectedTournament?.id || '');

  if (!selectedTournament?.stages?.length) {
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

  return (
    <FlexContainer
      flexDirection="column"
      highlightRowOnHover
      padding="0px 20px"
      width="100%"
      loading={isFetching}
    >
      {activityList?.map((activity) => {
        const scheduledGame = selectedTournament.stages
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
