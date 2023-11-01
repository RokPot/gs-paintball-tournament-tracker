import { Button, Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import PageContainer from 'components/shared/PageContainer';
import TournamentDetailsInfo from 'components/tournament/TournamentDetailsInfo';
import useTournamentStore from 'store/TournamentStore';

const TournamentPage: React.FC = () => {
  const { selectedTournament, setSelectedTournament } = useTournamentStore();
  return (
    <PageContainer>
      <FlexContainer width="100%" justifyContent="space-between">
        <Typography variant="h4">
          Tournament - Turnir 2022 Gluhi Svizci
        </Typography>
        <Button onClick={() => {}}>
          <Typography variant="body1">Create a new tournament</Typography>
        </Button>
      </FlexContainer>
      {selectedTournament && (
        <Typography
          variant="subtitle1"
          color={(theme) => theme.palette.text.secondary}
        >
          No tournament selected, please create a new tournament or select
          existing one
        </Typography>
      )}
      {!selectedTournament && (
        <>
          <Typography variant="h5">Tournament details</Typography>
          <FlexContainer width="100%" justifyContent="flex-start" margin={16}>
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
              <TournamentDetailsInfo title="Required match wins" value={2} />
            </FlexContainer>
            <FlexContainer
              flexDirection="column"
              justifyContent="center"
              alignItems="flex-start"
              highlightRowOnHover
            >
              <TournamentDetailsInfo title="# of total games" value={7} />
              <TournamentDetailsInfo title="# of total games" value={7} />
              <TournamentDetailsInfo title="# of finished games" value={3} />
              <TournamentDetailsInfo title="# of unfinished games" value={16} />
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
    </PageContainer>
  );
};

export default TournamentPage;
