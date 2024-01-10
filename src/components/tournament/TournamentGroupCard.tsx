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
      <FlexContainer flexDirection="column">
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

        <FlexContainer highlightRowOnHover flexDirection="column" width="100%">
          {group?.teams.map((team) => (
            <div style={{ padding: '8px', width: '100%' }}>
              <Typography>{team.teamName}</Typography>
            </div>
          ))}
        </FlexContainer>
      </FlexContainer>
    </StyledCard>
  );
};

export default TournamentGroupCard;
