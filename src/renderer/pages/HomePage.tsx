import styled from '@emotion/styled';
import {
  faAdd,
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
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import PageContainer from 'components/shared/PageContainer';
import QuickAddTournament from 'components/tournament/QuickAddTournament';
import useTournamentFlows from 'hooks/tournament/useTournamentFlows';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from 'renderer/main/Routes';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import League from 'types/League';
import Tournament from 'types/Tournament';
// Only import test panel in development
const RxDBTestPanel =
  process.env.NODE_ENV === 'development'
    ? require('components/rxdb-test/RxDBTestPanel').default
    : null;

const StyledStackingContainer = styled('div')(
  () => css`
    display: flex;
    width: 100%;
    flex-direction: row;
    gap: 15px;
  `,
);

const HomePage: React.FC = () => {
  const [quickAddTournamentForLeague, setQuickAddTournamentForLeague] =
    useState<League>();

  const theme = useTheme();
  const navigate = useNavigate();
  const { data: leaguesList, isLoading: isFetchingLeaguesList } =
    LeagueQueries.useLeaguesList();
  const { addNewTournamentToLeague } = useTournamentFlows();
  const { invalidateSelectedLeague } = LeagueQueries.useLeagueInvalidations();

  const addNewTournamentInternal = useCallback(
    async (tournament: Tournament, league?: League) => {
      if (!league || !tournament) {
        return;
      }
      await addNewTournamentToLeague(tournament, league);
      await invalidateSelectedLeague();
      setQuickAddTournamentForLeague(undefined);
    },
    [addNewTournamentToLeague, invalidateSelectedLeague],
  );

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
              <FlexContainer
                flexDirection="column"
                alignItems="flex-start"
                padding="16px"
              >
                <FlexContainer
                  flexDirection="row"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Typography variant="h4">{league.name}</Typography>
                  <IconButton aria-label="info" style={{ width: '40px' }}>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      width={15}
                      height={15}
                      color={theme.palette.primary.light}
                    />
                  </IconButton>
                </FlexContainer>
                <FlexContainer
                  flexDirection="row"
                  justifyContent="space-between"
                  width="100%"
                >
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
                  <Button
                    variant="text"
                    onClick={() => setQuickAddTournamentForLeague(league)}
                  >
                    <Typography variant="p1">
                      <FontAwesomeIcon icon={faAdd} /> Quick Tournament
                    </Typography>
                  </Button>
                </FlexContainer>
              </FlexContainer>
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
      {/* RxDB Test Panel - Only shown in development */}
      {RxDBTestPanel && <RxDBTestPanel />}
      <CustomModal
        isModalOpen={!!quickAddTournamentForLeague}
        onClose={() => {
          setQuickAddTournamentForLeague(undefined);
        }}
        width={700}
      >
        {!!quickAddTournamentForLeague && (
          <QuickAddTournament
            league={quickAddTournamentForLeague}
            onAccept={(tournament) =>
              addNewTournamentInternal(tournament, quickAddTournamentForLeague)
            }
            onCancel={() => setQuickAddTournamentForLeague(undefined)}
          />
        )}
      </CustomModal>
    </PageContainer>
  );
};

export default HomePage;
