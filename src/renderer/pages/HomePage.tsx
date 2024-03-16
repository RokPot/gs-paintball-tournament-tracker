import styled from '@emotion/styled';
import { faCogs, faSoap } from '@fortawesome/free-solid-svg-icons';
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
import useLeaguesList from 'services/queries/league/useLeaguesList';

const StyledStackingContainer = styled('div')(
  () => css`
    display: flex;
    width: 100%;
    flex-direction: row;
    gap: 15px;
  `,
);
const HomePage: React.FC = () => {
  const tryyySound = () => {
    window.electron.ipcRenderer.sendMessage(
      'open-new-window',
      'new_window.html',
    );
    // playCountdown();
  };
  // ToDo RokPot
  window.electron.ipcRenderer.on('buttons-response', (result) => {
    console.log(result);
  });

  const { leaguesList, isFetchingLeaguesList } = useLeaguesList();

  return (
    <PageContainer>
      <Typography variant="h6">Latest Leagues</Typography>
      <StyledStackingContainer>
        {leaguesList?.map((league) => (
          <Card style={{ width: '400px' }}>
            <CardHeader
              action={
                <IconButton aria-label="settings">
                  <FontAwesomeIcon icon={faCogs} width={15} />
                </IconButton>
              }
              title={league.name}
              subheader={
                <Typography>
                  <FontAwesomeIcon icon={faSoap} />
                  Tournaments:
                  {league.tournaments.length}
                  Teams:
                  {league.tournaments.length}
                </Typography>
              }
            />
          </Card>
        ))}

        <Card onClick={tryyySound}>
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
