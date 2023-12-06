import styled from '@emotion/styled';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Card,
  CardHeader,
  IconButton,
  Typography,
  css,
} from '@mui/material';
import PageContainer from 'components/shared/PageContainer';
import Team from 'types/Team';
import { generateGamesForRoundRobin } from 'utils/tournament/roundRobinUtils';
import { v4 } from 'uuid';

const StyledRootContainer = styled('div')(
  (props) => css`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
  `,
);
const StyledStackingContainer = styled('div')(
  (props) => css`
    display: flex;
    width: 100%;
    flex-direction: row;
    gap: 15px;
  `,
);
const HomePage: React.FC = () => {
  const numberOfTeams = 10;
  const teamss: Team[] = [];
  for (let i = 0; i < numberOfTeams; i += 1) {
    const newTeam = new Team({
      _id: v4(),
      id: v4(),
      teamName: `TBD${i + 1}`,
      teamTag: `TBD${i + 1}`,
    });
    teamss.push(newTeam);
  }
  generateGamesForRoundRobin(teamss);
  return (
    <PageContainer>
      <Typography variant="h6">Leagues</Typography>
      <StyledStackingContainer>
        <Card style={{ width: '400px' }}>
          <CardHeader
            action={
              <IconButton aria-label="settings">
                <FontAwesomeIcon icon={faCogs} width={15} />
              </IconButton>
            }
            title="SLO Cup 2022"
            subheader="22.5.2022 - 30.10.2022"
          />
        </Card>
        <Card>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'red' }} aria-label="recipe">
                R
              </Avatar>
            }
            action={<IconButton aria-label="settings" />}
            title="Shrimp and Chorizo Paella"
            subheader="September 14, 2016"
          />
        </Card>
        <Card>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'red' }} aria-label="recipe">
                R
              </Avatar>
            }
            action={<IconButton aria-label="settings" />}
            title="Shrimp and Chorizo Paella"
            subheader="September 14, 2016"
          />
        </Card>
        <Card>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'red' }} aria-label="recipe">
                R
              </Avatar>
            }
            action={<IconButton aria-label="settings" />}
            title="Shrimp and Chorizo Paella"
            subheader="September 14, 2016"
          />
        </Card>
      </StyledStackingContainer>

      <Typography variant="h6">Latest</Typography>
    </PageContainer>
  );
};

export default HomePage;
