import styled from '@emotion/styled';
import { Button, Typography, css, useTheme } from '@mui/material';
import LeagueDetails from 'components/leagues/LeagueDetails';
import CustomModal from 'components/shared/CustomModal';
import PageContainer from 'components/shared/PageContainer';
import { useState } from 'react';
import useGlobalStore from 'store/GlobalStore';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const StyledHeaderContainer = styled('div')(
  () => css`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  `
);
const LeaguesPage: React.FC = () => {
  const { setSelectedLeague } = useGlobalStore();
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);

  const theme = useTheme();
  return (
    <PageContainer>
      <StyledHeaderContainer>
        <Typography variant="h5">Leagues</Typography>
        <Button onClick={() => setIsLeagueModalOpen(true)}>
          <Typography variant="body1">Create a new league</Typography>
        </Button>
      </StyledHeaderContainer>
      <Button
        onClick={() => {
          setSelectedLeague({
            id: 'asd',
            leaderboard: [],
            name: 'League1',
            teams: [],
            tournaments: [],
          });
          setIsLeagueModalOpen(true);
        }}
      >
        hello
      </Button>
      <CustomModal
        isModalOpen={isLeagueModalOpen}
        onClose={() => {
          console.log(1);
          setIsLeagueModalOpen(false);
        }}
        width={700}
      >
        <LeagueDetails />
      </CustomModal>
    </PageContainer>
  );
};

export default LeaguesPage;
