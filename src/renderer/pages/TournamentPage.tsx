import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, IconButton, Typography, useTheme } from '@mui/material';
import SelectLeague from 'components/leagues/SelectLeague';
import FlexContainer from 'components/shared/FlexContainer';
import PageContainer from 'components/shared/PageContainer';
import SelectTournament from 'components/tournament/SelectTournament';
import TournamentDetailsInfo from 'components/tournament/TournamentDetailsInfo';
import useLeagueQueries from 'services/queries/LeagueQueries';
import useTournamentStore from 'store/TournamentStore';

const TournamentPage: React.FC = () => {
  const { selectedLeague, setSelectedLeague } = useLeagueQueries();
  const { selectedTournament, setSelectedTournament } = useTournamentStore();
  const theme = useTheme();
  return (
    <PageContainer>
      <FlexContainer width="100%" justifyContent="space-between">
        <Typography variant="h4">
          {selectedLeague
            ? `League - ${selectedLeague.name}`
            : 'No league selected'}
          {selectedLeague && (
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
          )}
        </Typography>
        <Button onClick={() => {}}>
          <Typography variant="body1">Create a new tournament</Typography>
        </Button>
      </FlexContainer>
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
            No leage is currently selected, please create a new league or select
            an existing one.
          </Typography>
          <SelectLeague />
        </FlexContainer>
      )}

      {selectedLeague && (
        <>
          <Typography variant="h5">
            {selectedTournament
              ? `Tournament - ${selectedTournament.name}`
              : 'No tournament selected'}
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
              <SelectTournament />
            </FlexContainer>
          )}
          {selectedTournament && (
            <>
              <Typography variant="h5">Tournament details</Typography>
              <FlexContainer
                width="100%"
                justifyContent="flex-start"
                margin={16}
              >
                <FlexContainer
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  highlightRowOnHover
                >
                  <TournamentDetailsInfo title="Status" value={'In Progress'} />
                  <TournamentDetailsInfo
                    title="Type"
                    value={'Round-Robin with groups'}
                  />
                  <TournamentDetailsInfo title="Team size" value={'3-man'} />
                  <TournamentDetailsInfo
                    title="Required match wins"
                    value={2}
                  />
                </FlexContainer>
                <FlexContainer
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  highlightRowOnHover
                >
                  <TournamentDetailsInfo title="# of total games" value={7} />
                  <TournamentDetailsInfo title="# of total games" value={7} />
                  <TournamentDetailsInfo
                    title="# of finished games"
                    value={3}
                  />
                  <TournamentDetailsInfo
                    title="# of unfinished games"
                    value={16}
                  />
                </FlexContainer>
                <FlexContainer
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  highlightRowOnHover
                >
                  <TournamentDetailsInfo title="Switch games" value={'Yes'} />
                  <TournamentDetailsInfo title="Number of Groups" value={3} />
                  <TournamentDetailsInfo title="Switch groups" value={'Yes'} />
                  <TournamentDetailsInfo title="Games played" value={7} />
                </FlexContainer>
              </FlexContainer>

              <Typography variant="h5">Participating teams</Typography>
            </>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default TournamentPage;
