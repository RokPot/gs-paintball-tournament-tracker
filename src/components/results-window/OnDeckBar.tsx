import { Typography, alpha, lighten, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { Fragment } from 'react';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { getDisplayTeamName } from 'utils/tournamentUtils';

const FONT_SIZE = 'clamp(1.3rem, 5.6vh, 5.5rem)';
const LABEL_FONT_SIZE = 'clamp(1rem, 3.6vh, 3.25rem)';

interface IProps {
  onDeckGames: TournamentScheduleGame[];
}

const OnDeckBar: React.FC<IProps> = ({ onDeckGames }) => {
  const theme = useTheme();
  const textColor = theme.palette.text.primary;
  const mutedTextColor = theme.palette.text.secondary;

  if (!onDeckGames.length) {
    return null;
  }

  return (
    <FlexContainer
      width="100%"
      // Baseline rather than centre, otherwise the label, the separators and
      // the team names each sit at a different height because their font
      // sizes differ.
      alignItems="baseline"
      justifyContent="center"
      gap={16}
      flexWrap="wrap"
      padding="1vh 16px"
      style={{
        background: lighten(theme.palette.primary.light, 0.45),
        boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.15)}`,
        boxSizing: 'border-box',
      }}
    >
      <Typography
        variant="p1Bold"
        fontSize={LABEL_FONT_SIZE}
        lineHeight="1em"
        color={mutedTextColor}
        style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        Next up
      </Typography>
      {onDeckGames.map((scheduledGame, index) => (
        <Fragment key={scheduledGame.id}>
          {index > 0 && (
            <Typography
              variant="p1"
              fontSize={LABEL_FONT_SIZE}
              lineHeight="1em"
              color={mutedTextColor}
            >
              ,
            </Typography>
          )}
          <Typography
            variant="p1Bold"
            fontSize={FONT_SIZE}
            lineHeight="1em"
            color={textColor}
            style={{ whiteSpace: 'nowrap' }}
          >
            {getDisplayTeamName(scheduledGame.game.team1)}
            <Typography
              variant="p1"
              fontSize={LABEL_FONT_SIZE}
              lineHeight="1em"
              color={mutedTextColor}
              padding="0 0.4em"
            >
              vs
            </Typography>
            {getDisplayTeamName(scheduledGame.game.team2)}
          </Typography>
        </Fragment>
      ))}
    </FlexContainer>
  );
};

export default OnDeckBar;
