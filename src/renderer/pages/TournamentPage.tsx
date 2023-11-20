import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, IconButton, Typography, useTheme } from '@mui/material';
import SelectLeague from 'components/leagues/SelectLeague';
import FlexContainer from 'components/shared/FlexContainer';
import PageContainer from 'components/shared/PageContainer';
import TeamsShortList from 'components/teams/TeamShortList';
import SelectTournament from 'components/tournament/SelectTournament';
import TournamentDetailsList from 'components/tournament/TournamentDetailsList';
import { useEffect, useState } from 'react';
import useLeagueQueries from 'services/queries/LeagueQueries';
import { Tournament } from 'types/Tournament';
import { TournamentStage } from 'types/TournamentStage';

const TournamentPage: React.FC = () => {
  const {
    selectedLeague,
    setSelectedLeague,
    updateExistingLeague,
    invalidateSelectedLeague,
  } = useLeagueQueries();
  const [firstLoad, setFirstLoad] = useState(true);

  const theme = useTheme();
  const selectedTournament = selectedLeague?.activeTournament;
  const setSelectedTournament = async (tournament?: Tournament) => {
    if (!selectedLeague) {
      return;
    }
    const updatedLeague = selectedLeague;
    updatedLeague.activeTournament = tournament ? tournament : undefined;
    await updateExistingLeague(updatedLeague);

    await invalidateSelectedLeague();
  };

  useEffect(() => {
    if (!selectedLeague || selectedLeague.activeTournament || !firstLoad) {
      if (selectedLeague?.activeTournament) {
        setFirstLoad(false);
      }
      return;
    }

    const unfinishedLeagueTournaments = selectedLeague.tournaments.filter(
      (tournament) => tournament.state.stage !== TournamentStage.finished
    );

    if (unfinishedLeagueTournaments?.length > 0) {
      const inProgressTournament = selectedLeague.tournaments.find(
        (tournament) => tournament.state.stage === TournamentStage.inProgress
      );
      if (inProgressTournament) {
        setSelectedTournament(inProgressTournament);
      }

      const initializedTournament = selectedLeague.tournaments.find(
        (tournament) => tournament.state.stage === TournamentStage.initialized
      );
      if (initializedTournament) {
        setSelectedTournament(initializedTournament);
      }
      const createdTournament = selectedLeague.tournaments.find(
        (tournament) => tournament.state.stage === TournamentStage.created
      );
      if (createdTournament) {
        setSelectedTournament(createdTournament);
      }
    }
    setFirstLoad(false);
  }, [selectedLeague]);

  return (
    <PageContainer>
      {selectedLeague ? (
        <FlexContainer width="100%" justifyContent="space-between">
          <Typography variant="h4">
            League -
            <Typography variant="h4Medium" display="inline-block">
              {selectedLeague.name}
            </Typography>
            <IconButton
              style={{ width: '20px', height: '20px', marginLeft: 'auto' }}
              onClick={() => setSelectedLeague(null, selectedLeague)}
            >
              <FontAwesomeIcon
                icon={faRemove}
                width={10}
                color={theme.palette.primary.main}
              />
            </IconButton>
          </Typography>
          {selectedTournament ? (
            <Button onClick={() => {}}>
              <Typography variant="body1">Edit tournament</Typography>
            </Button>
          ) : (
            <Button onClick={() => {}}>
              <Typography variant="body1">Create a new tournament</Typography>
            </Button>
          )}
        </FlexContainer>
      ) : (
        <Typography variant="h4">No league selected</Typography>
      )}

      {!selectedLeague && (
        <FlexContainer
          width="100%"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          margin={8}
        >
          <Typography
            variant="subtitle1"
            color={(theme) => theme.palette.text.secondary}
          >
            No league is currently selected, please create a new league or
            select an existing one.
          </Typography>
          <SelectLeague />
        </FlexContainer>
      )}

      {selectedLeague && (
        <>
          <Typography variant="h5">
            {selectedTournament ? (
              <>
                Tournament -
                <Typography variant="h5Medium" display="inline-block">
                  {selectedTournament?.name}
                </Typography>
              </>
            ) : (
              'No tournament selected'
            )}
            {selectedTournament && (
              <IconButton
                style={{ width: '20px', height: '20px', marginLeft: 'auto' }}
                onClick={() => setSelectedTournament(undefined)}
              >
                <FontAwesomeIcon
                  icon={faRemove}
                  width={10}
                  color={theme.palette.primary.main}
                />
              </IconButton>
            )}
          </Typography>
          {!selectedTournament && (
            <FlexContainer
              width="100%"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              margin={8}
            >
              <Typography
                variant="subtitle1"
                color={(theme) => theme.palette.text.secondary}
              >
                No tournament is currently selected, please create a new
                tournament or select existing one.
              </Typography>
              <SelectTournament onTournamentSelected={setSelectedTournament} />
            </FlexContainer>
          )}
          {selectedTournament && (
            <>
              <Typography variant="h5">Tournament details</Typography>
              <TournamentDetailsList tournament={selectedTournament} />
              <Typography variant="h5">Participating teams</Typography>
              <TeamsShortList teams={selectedTournament.teams} />
            </>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default TournamentPage;
