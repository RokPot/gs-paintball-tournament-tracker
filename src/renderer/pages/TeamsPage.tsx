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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CustomDataTable from 'components/shared/CustomDataTable';
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import PageContainer from 'components/shared/PageContainer';
import QuickAddTeam from 'components/teams/QuickAddTeam';
import { useEffect, useState } from 'react';
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
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams().then((res) => res),
  });

  useEffect(() => {
    console.log(data);
    setTeams(data || []);
  }, [data]);

  const columns: GridColDef<Team>[] = [
    {
      field: 'Team',
      headerName: 'Team name',
      minWidth: 150,
      maxWidth: 350,
      renderCell: (params) => {
        return (
          <FlexContainer flexDirection="row" margin={8}>
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
      renderCell: () => <div></div>,
      renderHeader: () => <div></div>,
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
            <IconButton onClick={() => null} style={{ height: '30px' }}>
              <FontAwesomeIcon icon={faListDots} width={15} height={15} />
            </IconButton>
            <IconButton onClick={() => null} style={{ height: '30px' }}>
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

  return (
    <PageContainer>
      <StyledHeaderContainer>
        <Typography variant="h4">Teams</Typography>
        <Button onClick={() => setIsTeamAddModalOpen(true)}>
          <Typography variant="body1">Create a new team</Typography>
        </Button>
      </StyledHeaderContainer>

      <div style={{ height: '100%' }}>
        <CustomDataTable
          columns={columns}
          rows={teams}
          loading={isFetching}
          height="100%"
        />
      </div>

      <CustomModal
        isModalOpen={isTeamAddModalOpen}
        onClose={() => setIsTeamAddModalOpen(false)}
        width={600}
      >
        <QuickAddTeam
          onAccept={(team) => {
            addNewTeam(team);
            queryClient.invalidateQueries({ queryKey: ['leagues'] });
            setIsTeamAddModalOpen(false);
          }}
          onCancel={() => setIsTeamAddModalOpen(false)}
        />
      </CustomModal>
    </PageContainer>
  );
};

export default TeamsPage;
