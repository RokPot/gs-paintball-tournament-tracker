import { Card, Typography, alpha, css, styled, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import TournamentGroup from 'types/TournamentGroup';

const StyledCard = styled(Card)(
  (props) => css`
    box-shadow: ${alpha(props.theme.palette.primary.main, 0.5)} 0px 5px 15px;
    border: solid 1px ${alpha(props.theme.palette.primary.main, 0.2)};
    margin: 8px;
    padding: 16px;
    min-width: 200px;
    min-height: 300px;
  `,
);

interface IProps {
  group: TournamentGroup;
}

const TournamentGroupCard: React.FC<IProps> = ({ group }) => {
  const theme = useTheme();

  return (
    <StyledCard>
      <FlexContainer flexDirection="column" height="100%">
        <FlexContainer
          width="100%"
          flexDirection="row"
          justifyContent="space-between"
          style={{
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h3Medium" width="100%">
            Group {group.groupIndex}
          </Typography>
        </FlexContainer>

        <FlexContainer
          highlightRowOnHover
          flexDirection="column"
          width="100%"
          height="100%"
        >
          {group?.teams.map((team) => (
            <div style={{ padding: '8px', width: '100%' }}>
              <Typography>{team.teamName}</Typography>
            </div>
          ))}
        </FlexContainer>
        <FlexContainer
          flexDirection="column"
          width="100%"
          gap={8}
          justifyContent="center"
          alignItems="flex-start"
          style={{
            borderTop: `1px solid ${theme.palette.divider}`,
            paddingTop: '8px',
          }}
        >
          <Typography variant="p1Medium">
            # of teams:{' '}
            <Typography variant="p1Medium" color={theme.palette.primary.main}>
              {group.teams.length}
            </Typography>
          </Typography>
          <Typography variant="p1Medium">
            # of games:{' '}
            <Typography variant="p1Medium" color={theme.palette.primary.main}>
              {group.games.length}
            </Typography>
          </Typography>
        </FlexContainer>
      </FlexContainer>
    </StyledCard>
  );
};

export default TournamentGroupCard;
