import { Button, Card, Typography, alpha, styled } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import Team from 'types/Team';

const StyledTeamHeader = styled('div')(
  (props) => `
 background: ${props.theme.palette.primary.light};
    width: 100%;
    text-align: center;
    padding: 8px;
    border-radius: 2px 2px 20px 20px;
`,
);

const StyledTeamScoreTypography = styled(Typography)`
  font-size: 120px;
  line-height: normal;
`;
const StyledHeaderTypography = styled(Typography)`
  line-height: normal;
  font-size: 40px;
`;
const StyledCard = styled(Card)(
  (props) => `
    box-shadow: ${alpha(props.theme.palette.primary.main, 0.5)} 0px 5px 15px;
    border: solid 1px ${alpha(props.theme.palette.primary.main, 0.2)};
    min-width: 100px;
    max-width: 300px;
    width: 100%;
    height: 100%;
    max-height: 300px;
    min-height: 100px;
    flex: 1;
    `,
);

interface IProps {
  team?: Team;
  teamScore?: number;
}

const TeamScoreCard: React.FC<IProps> = ({ team, teamScore }) => {
  return (
    <StyledCard className="custom-card teams-card">
      <FlexContainer flexDirection="column" gap={8}>
        <StyledTeamHeader>
          <StyledHeaderTypography
            variant="h1Medium"
            color={(theme) => theme.palette.primary.contrastText}
          >
            {team?.teamName || 'Team'}
          </StyledHeaderTypography>
        </StyledTeamHeader>
        <StyledTeamScoreTypography variant="h3Medium">
          {teamScore || 0}
        </StyledTeamScoreTypography>
        <Button variant="contained" color="info">
          <Typography variant="p1Medium">Take pause</Typography>
        </Button>
      </FlexContainer>
    </StyledCard>
  );
};

export default TeamScoreCard;
