import { Button, Typography, css, styled } from '@mui/material';
import CustomModal from 'components/shared/CustomModal';
import PageContainer from 'components/shared/PageContainer';
import QuickAddTeam from 'components/teams/QuickAddTeam';
import TeamsShortList from 'components/teams/TeamShortList';
import { useCallback, useEffect, useState } from 'react';
import useTeamService from 'services/TeamService';
import usePouchDB from 'services/pouchDB';
import { Team } from 'types/Team';

const StyledHeaderContainer = styled('div')(
  () => css`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  `
);
const TeamsPage: React.FC = () => {
  const [isTeamAddModalOpen, setIsTeamAddModalOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const { addNewTeam, getTeams } = useTeamService();
  const dbb = usePouchDB('teams');
  dbb
    .query('_teams/all')
    .then(function (res) {
      // got the query results
      console.log(res);
    })
    .catch(function (err) {
      // some error
      console.log(err);
    });
  const refreshTeams = useCallback(async () => {
    const result = await getTeams();
    setTeams(result);
  }, []);

  useEffect(() => {
    refreshTeams();
  }, []);

  return (
    <PageContainer>
      <StyledHeaderContainer>
        <Typography variant="h4">Teams</Typography>
        <Button onClick={() => setIsTeamAddModalOpen(true)}>
          <Typography variant="body1">Create a new team</Typography>
        </Button>
      </StyledHeaderContainer>
      <TeamsShortList teams={teams} />
      <CustomModal
        isModalOpen={isTeamAddModalOpen}
        onClose={() => setIsTeamAddModalOpen(false)}
        width={600}
      >
        <QuickAddTeam
          onAccept={(team) => {
            addNewTeam(team);
            setIsTeamAddModalOpen(false);
            refreshTeams();
          }}
          onCancel={() => setIsTeamAddModalOpen(false)}
        />
      </CustomModal>
    </PageContainer>
  );
};

export default TeamsPage;
