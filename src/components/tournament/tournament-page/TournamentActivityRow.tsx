import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { format } from 'date-fns';
import TournamentActivity from 'types/TournamentActivity';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { millisecondsToTime, secondsToTime } from 'utils/dateUtils';

interface IProps {
  activity: TournamentActivity;
  scheduledGame?: TournamentScheduleGame;
}
const TournamentActivityRow: React.FC<IProps> = ({
  activity,
  scheduledGame,
}) => {
  const theme = useTheme();
  const formattedGameDuration = secondsToTime(activity.gameTime);
  const formattedMatchDuration = millisecondsToTime(
    activity?.match?.matchDurationInSeconds || 0,
  );

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
        <Typography variant="p2Medium" color={theme.palette.text.disabled}>
          {format(activity.updatedAt, 'dd/MM/yyyy')}
        </Typography>
        <Typography variant="p2Medium" color={theme.palette.text.disabled}>
          {format(activity.updatedAt, 'HH:mm')}
        </Typography>
      </FlexContainer>
      <FlexContainer flexDirection="column" alignItems="flex-start">
        <Typography variant="p1Medium">
          <Typography variant="p1">
            Game {scheduledGame?.gameNumber}{' '}
          </Typography>
          ({scheduledGame?.game.team1.teamName} vs{' '}
          {scheduledGame?.game.team2.teamName})
        </Typography>{' '}
        <Typography variant="p2" color={theme.palette.text.disabled}>
          Game time:{' '}
          <Typography variant="p2Medium" color={theme.palette.text.secondary}>
            {formattedGameDuration.formatted}
            <Typography variant="p2Medium" color={theme.palette.text.secondary}>
              .{formattedGameDuration.milisecondsString}
            </Typography>
          </Typography>{' '}
          {activity?.match && (
            <>
              Match Duration:{' '}
              <Typography
                variant="p2Medium"
                color={theme.palette.text.secondary}
              >
                {formattedMatchDuration.formatted}
                <Typography
                  variant="p2Medium"
                  color={theme.palette.text.secondary}
                >
                  .{formattedMatchDuration.milisecondsString}
                </Typography>
              </Typography>
            </>
          )}{' '}
          Score:{' '}
          <Typography variant="p2Medium" color={theme.palette.primary.main}>
            {activity.nextTeam1Wins} vs {activity.nextTeam2Wins}
          </Typography>
        </Typography>
        {activity.previousTeam1Wins !== activity.nextTeam1Wins && (
          <FlexContainer gap={16}>
            <Typography variant="p1Medium" color={theme.palette.text.disabled}>
              {scheduledGame?.game?.team1.teamName}:
            </Typography>
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
        )}
        {activity.previousTeam2Wins !== activity.nextTeam2Wins && (
          <FlexContainer gap={16}>
            <Typography variant="p1Medium" color={theme.palette.text.disabled}>
              {scheduledGame?.game?.team2.teamName}:
            </Typography>
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
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default TournamentActivityRow;
