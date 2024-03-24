import { faListDots, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  css,
  styled,
  useTheme,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataTable from 'components/shared/CustomDataTable';
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import PageContainer from 'components/shared/PageContainer';
import AddOrEditTeam from 'components/teams/AddOrEditTeam';
import useTeamFlows from 'hooks/team/useTeamFlows';
import { useEffect, useRef, useState } from 'react';
import { TeamQueries } from 'services/queries/team/TeamQueries';
import useConfirmationModalStore from 'store/ConfirmationModalStore';
import Team from 'types/Team';

const StyledHeaderContainer = styled('div')(
  () => css`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  `,
);
const TeamsPage = () => {
  const [isTeamUpsertModalOpen, setIsTeamUpsertModalOpen] = useState(false);
  const [teamToUpsert, setTeamToUpsert] = useState<Team>();
  const { openModal } = useConfirmationModalStore();
  const theme = useTheme();
  const { data: teamsList, isLoading: isFetchingTeamsList } =
    TeamQueries.useTeamsList();
  const { mutateAsync: deleteTeam } = TeamQueries.useDeleteTeam();
  const { invalidateTeamsList } = TeamQueries.useTeamInvalidations();
  const { addOrEditTeam } = useTeamFlows();

  const addNewTeam = async (team: Team, update?: boolean) => {
    addOrEditTeam(team, update);
    setIsTeamUpsertModalOpen(false);
  };

  const removeTeam = async (team: Team) => {
    openModal({
      title: 'Are you sure you want to delete this team?',
      Confirmation:
        'Team will be deletea and all data regarding this team will be lost.',
      onConfirm: async () => {
        await deleteTeam(team);
        await invalidateTeamsList();
      },
    });
  };

  const editTeam = async (team: Team) => {
    setIsTeamUpsertModalOpen(true);
    setTeamToUpsert(team);
  };

  const columns: GridColDef<Team>[] = [
    {
      field: 'Team',
      headerName: 'Team name',
      minWidth: 150,
      maxWidth: 350,
      renderCell: (params) => {
        return (
          <FlexContainer flexDirection="row" gap={8}>
            <Avatar
              variant="rounded"
              style={{ backgroundColor: params?.row?.color }}
            >
              <Typography
                variant="p3Medium"
                style={{ textTransform: 'uppercase' }}
              >
                {params?.row?.teamTag}
              </Typography>
            </Avatar>
            <Typography variant="p2Medium">{params?.row?.teamName}</Typography>
          </FlexContainer>
        );
      },
    },
    {
      field: 'wins',
      headerName: 'Wins',
      width: 100,
    },
    {
      field: 'loses',
      headerName: 'Loses',
      width: 100,
    },
    {
      field: 'draw',
      headerName: 'Draws',
      width: 100,
    },
    {
      field: 'empty',
      headerName: '',
      renderCell: () => <div />,
      renderHeader: () => <div />,
      hideSortIcons: true,
      flex: 1,
    },
    {
      field: 'actions',
      width: 100,
      renderCell: (params) => {
        return (
          <FlexContainer
            width="100%"
            justifyContent="center"
            alignItems="center"
          >
            <IconButton
              onClick={() => editTeam(params?.row)}
              style={{ height: '30px' }}
            >
              <FontAwesomeIcon icon={faListDots} width={15} height={15} />
            </IconButton>
            <IconButton
              onClick={() => removeTeam(params?.row)}
              style={{ height: '30px' }}
            >
              <FontAwesomeIcon
                icon={faRemove}
                width={15}
                height={15}
                color={theme.palette.error.dark}
              />
            </IconButton>
          </FlexContainer>
        );
      },
    },
  ];

  const closeModal = () => {
    setIsTeamUpsertModalOpen(false);
    setTeamToUpsert(undefined);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number | null>(null);
  useEffect(() => {
    if (!containerRef?.current) {
      return;
    }
    const containerRefHeight = containerRef.current.offsetHeight;
    const rowHeight = 60;
    const availableRowsPerPage = Math.floor(containerRefHeight / rowHeight);
    setRowsPerPage(availableRowsPerPage || 5);
  }, []);

  return (
    <PageContainer>
      <StyledHeaderContainer>
        <Typography variant="h4">Teams</Typography>
        <Button onClick={() => setIsTeamUpsertModalOpen(true)}>
          <Typography variant="body1">Create a new team</Typography>
        </Button>
      </StyledHeaderContainer>

      <div style={{ height: 'calc(100% - 40px)' }} ref={containerRef}>
        {rowsPerPage !== null && rowsPerPage > 0 && (
          <CustomDataTable
            columns={columns}
            rows={teamsList || []}
            loading={isFetchingTeamsList}
            height="100%"
            pageSize={rowsPerPage}
          />
        )}
      </div>

      <CustomModal
        isModalOpen={isTeamUpsertModalOpen}
        onClose={closeModal}
        width={600}
      >
        <AddOrEditTeam
          team={teamToUpsert}
          onAccept={addNewTeam}
          onCancel={closeModal}
        />
      </CustomModal>
    </PageContainer>
  );
};

export default TeamsPage;
