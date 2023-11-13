import { Button, Typography, css, styled } from '@mui/material';
import CustomModal from 'components/shared/CustomModal';
import PageContainer from 'components/shared/PageContainer';
import QuickAddTeam from 'components/teams/QuickAddTeam';
import TeamsShortList from 'components/teams/TeamShortList';
import { useCallback, useEffect, useState } from 'react';
import useTeamService from 'services/TeamService';
import useConfirmationModalStore from 'store/ConfirmationModalStore';
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
  const { addNewTeam, getTeams, deleteTeam } = useTeamService();
  const { openModal } = useConfirmationModalStore();
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
      <TeamsShortList
        teams={teams}
        showRemoveButton
        onRemoveTeam={async (team) => {
          openModal({
            title: 'Are you sure you want to leave?',
            Confirmation:
              'You have unsaved changes. All changes will be lost if you leave without saving.',
            onConfirm: () => {
              console.log('confirmed');
            },
            onClose: () => {
              console.log('not confirmed');
            },
          });
          //
          // await deleteTeam(team);
        }}
      />
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
