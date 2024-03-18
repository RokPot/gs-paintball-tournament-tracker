import styled from '@emotion/styled';
import {
  faInfoCircle,
  faNetworkWired,
  faPeopleGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  IconButton,
  Typography,
  css,
  useTheme,
} from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import PageContainer from 'components/shared/PageContainer';
import { useNavigate } from 'react-router-dom';
import routes from 'renderer/main/Routes';
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
  const theme = useTheme();
  const navigate = useNavigate();
  // ToDo RokPot
  window.electron.ipcRenderer.on('buttons-response', (result) => {
    console.log(result);
  });

  const { leaguesList, isFetchingLeaguesList } = useLeaguesList();

  return (
    <PageContainer>
      <Typography variant="h4">Leagues</Typography>
      <FlexContainer
        flexDirection="column"
        width="100%"
        gap={8}
        alignItems="flex-start"
      >
        {!isFetchingLeaguesList && (leaguesList?.length || 0) <= 0 && (
          <Card>
            <CardHeader
              title={
                <Typography variant="p1" display="block" textAlign="center">
                  No leagues yet
                </Typography>
              }
              subheader={
                <Button
                  variant="contained"
                  onClick={() => navigate(routes.LEAGUES)}
                >
                  <Typography>Create new league</Typography>
                </Button>
              }
            />
          </Card>
        )}

        {leaguesList?.map((league) => (
          <StyledStackingContainer key={league.id}>
            <Card style={{ width: '400px' }}>
              <CardHeader
                action={
                  <IconButton aria-label="info" style={{ width: '40px' }}>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      width={15}
                      height={15}
                      color={theme.palette.primary.light}
                    />
                  </IconButton>
                }
                title={league.name}
                subheader={
                  <Typography
                    variant="p1Medium"
                    color={theme.palette.text.secondary}
                  >
                    <FontAwesomeIcon
                      icon={faNetworkWired}
                      color={theme.palette.primary.main}
                      width={30}
                      height={30}
                      fontSize={16}
                    />
                    {league.tournaments.length}
                    <FontAwesomeIcon
                      icon={faPeopleGroup}
                      color={theme.palette.primary.main}
                      width={30}
                      height={30}
                      fontSize={16}
                    />
                    {league.teams.length}
                  </Typography>
                }
              />
            </Card>
            {league?.tournaments?.length <= 0 && (
              <Card>
                <CardHeader
                  title={
                    <Typography variant="p1" display="block" textAlign="center">
                      No Tournaments yet
                    </Typography>
                  }
                  subheader={
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate(routes.getTournamentWithLeagueRoute(league.id))
                      }
                    >
                      <Typography>Create new tournament</Typography>
                    </Button>
                  }
                />
              </Card>
            )}
            {league?.tournaments
              ?.reverse()
              .slice(0, 4)
              .map((tournament, index) => (
                <Card style={{ width: '300px' }} key={tournament.id}>
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{ bgcolor: theme.palette.secondary.light }}
                        aria-label="recipe"
                      >
                        {league.tournaments.length - index}
                      </Avatar>
                    }
                    title={
                      <Typography variant="p1" display="block">
                        {tournament.name}
                      </Typography>
                    }
                    subheader={
                      <Typography variant="p2">
                        {tournament?.startDate?.format('DD/MM/YYYY')}
                        {tournament?.endDate
                          ? ` - ${tournament?.endDate?.format('DD/MM/YYYY')}`
                          : ''}
                      </Typography>
                    }
                  />
                </Card>
              ))}
          </StyledStackingContainer>
        ))}
      </FlexContainer>

      <Typography variant="h5">Latest Updates</Typography>
      <Typography>--TBD--</Typography>
    </PageContainer>
  );
};

export default HomePage;
