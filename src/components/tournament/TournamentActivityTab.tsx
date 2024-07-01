import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography, useTheme } from '@mui/material';
import EmptyInboxIcon from 'assets/icons/EmptyInbox';
import FlexContainer from 'components/shared/FlexContainer';
import { format } from 'date-fns';
import { TournamentQueries } from 'services/queries/tournament/TournamentQueries';
import ActivityChangeType from 'types/ActivityChangeType';
import Game from 'types/Game';
import League from 'types/League';
import TournamentActivity from 'types/TournamentActivity';
import { DocType } from 'types/interfaces/IPouchDB';
import { millisecondsToTime } from 'utils/dateUtils';

interface IProps {
  activeLeague: League;
}

const TournamentActivityTab = ({ activeLeague }: IProps) => {
  const theme = useTheme();
  const selectedTournament = activeLeague?.activeTournament;

  const { data: activityList } = TournamentQueries.useTournamentActivityList(
    selectedTournament?.id || '',
  );
  console.log(activityList);
  const tournamentActivities: TournamentActivity[] = [
    new TournamentActivity({
      _id: '1',
      _rev: '1',
      docType: DocType.TournamentActivity,
      id: '1',
      updatedAt: new Date(),
      gameTime: 5 * 60 * 1000,
      game:
        selectedTournament?.currentStageSchedule?.[0].game ||
        new Game({} as any),
      changeType: ActivityChangeType.MatchFinished,
      previousTeam1Wins: 1,
      previousTeam2Wins: 0,
      nextTeam1Wins: 0,
      nextTeam2Wins: 0,
      tournamentId: '1',
      stage: 1,
    }),
    new TournamentActivity({
      _id: '2',
      _rev: '2',
      docType: DocType.TournamentActivity,
      id: '2',
      updatedAt: new Date(),
      gameTime: 5 * 60 * 1000,

      game:
        selectedTournament?.currentStageSchedule?.[0].game ||
        new Game({} as any),
      changeType: ActivityChangeType.MatchFinished,
      previousTeam1Wins: 2,
      previousTeam2Wins: 0,
      nextTeam1Wins: 1,
      nextTeam2Wins: 0,
      tournamentId: '1',
      stage: 1,
    }),
  ];
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
    >
      {tournamentActivities.map((activity) => {
        const formattedDuration = millisecondsToTime(activity.gameTime || 0);
        const scheduledGame = selectedTournament.stages
          ?.flatMap((stage) => stage.schedule)
          ?.find((schedGame) => schedGame.game.id === activity.game.id);
        return (
          <FlexContainer
            flexDirection="row"
            gap={16}
            key={activity.id}
            width="100%"
            padding="8px"
          >
            <FlexContainer
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="flex-start"
              height="100%"
              padding="1px 0px"
            >
              <Typography
                variant="p2Medium"
                color={theme.palette.text.disabled}
              >
                {format(activity.updatedAt, 'dd/MM/yyyy')}
              </Typography>
              <Typography
                variant="p2Medium"
                color={theme.palette.text.disabled}
              >
                {format(activity.updatedAt, 'HH:mm')}
              </Typography>
            </FlexContainer>
            <FlexContainer flexDirection="column" alignItems="flex-start">
              <Typography variant="p1Medium">
                Game {scheduledGame?.gameNumber} (
                {scheduledGame?.game.team1.teamName} vs{' '}
                {scheduledGame?.game.team2.teamName})
              </Typography>
              <Typography variant="p2" color={theme.palette.text.disabled}>
                Game time:{' '}
                <Typography
                  variant="p2Medium"
                  color={theme.palette.text.secondary}
                >
                  {formattedDuration.formatted}
                  <Typography
                    variant="p2Medium"
                    color={theme.palette.text.secondary}
                  >
                    .{formattedDuration.milisecondsString}
                  </Typography>
                </Typography>
              </Typography>
              <FlexContainer gap={16}>
                <Typography variant="p1Bold" color={theme.palette.text.primary}>
                  {activity.previousTeam1Wins}
                </Typography>
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  width={30}
                  color={theme.palette.primary.main}
                />
                <Typography variant="p1Bold" color={theme.palette.text.primary}>
                  {activity.nextTeam1Wins}
                </Typography>
              </FlexContainer>
              <FlexContainer gap={16}>
                <Typography variant="p1Bold" color={theme.palette.text.primary}>
                  {activity.previousTeam2Wins}
                </Typography>
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  width={30}
                  color={theme.palette.primary.main}
                />
                <Typography variant="p1Bold" color={theme.palette.text.primary}>
                  {activity.nextTeam2Wins}
                </Typography>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
        );
      })}
    </FlexContainer>
  );
};

export default TournamentActivityTab;
