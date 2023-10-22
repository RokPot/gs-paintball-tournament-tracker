import styled from '@emotion/styled';
import {
  faCheckToSlot,
  faListDots,
  faRemove,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, IconButton, Typography, css, useTheme } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import LeagueDetails from 'components/leagues/LeagueDetails';
import DataTable from 'components/leagues/LeaguesTable';
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import PageContainer from 'components/shared/PageContainer';
import { useState } from 'react';
import useGlobalStore from 'store/GlobalStore';
import { League } from 'types/League';

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
  const { setSelectedLeague, addLeague, updateSelectedLeague, allLeagues } =
    useGlobalStore();
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const [leagues, setLeagues] = useState<League[]>([]);

  const theme = useTheme();

  const confirmLeague = (league: League, isEdit: boolean) => {
    if (isEdit) {
      updateSelectedLeague(league);
    } else {
      addLeague(league);
    }
    setIsLeagueModalOpen(false);
  };
  const onEditClick = (param: any) => {
    console.log(param);
  };
  const columns: GridColDef<League>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'League name' },
    {
      field: 'teams',
      headerName: '# of Participating teams',
      flex: 1,
      valueGetter: (params) => `${params?.row?.teams?.length || 0}`,
    },
    {
      field: 'tournaments',
      headerName: '# of Tournaments',
      valueGetter: (params) => `${params?.row?.tournaments?.length || 0}`,
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
              onClick={() => onEditClick(params.row)}
              style={{ height: '30px' }}
            >
              <FontAwesomeIcon icon={faListDots} width={15} height={15} />
            </IconButton>
            <IconButton
              onClick={() => onEditClick(params.row)}
              style={{ height: '30px' }}
            >
              <FontAwesomeIcon
                icon={faRemove}
                width={15}
                height={15}
                color={theme.palette.error.dark}
              />
            </IconButton>
            <IconButton
              onClick={() => onEditClick(params.row)}
              style={{ height: '30px' }}
            >
              <FontAwesomeIcon icon={faCheckToSlot} width={15} height={15} />
            </IconButton>
          </FlexContainer>
        );
      },
    },
  ];
  const rows: League[] = [
    {
      id: '1',
      leaderboard: [],
      name: 'League 1',
      teams: [{} as any],
      tournaments: [],
    },
    { id: '2', leaderboard: [], name: 'League 2', teams: [], tournaments: [] },
    { id: '3', leaderboard: [], name: 'League 3', teams: [], tournaments: [] },
    { id: '4', leaderboard: [], name: 'League 4', teams: [], tournaments: [] },
    { id: '5', leaderboard: [], name: 'League 5', teams: [], tournaments: [] },
    {
      id: 'z6sdf6',
      leaderboard: [],
      name: 'League 6',
      teams: [],
      tournaments: [],
    },
  ];
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
      <DataTable columns={columns} rows={rows} />
      {allLeagues?.map((league) => (
        <div>{league.name}</div>
      ))}
      <CustomModal
        isModalOpen={isLeagueModalOpen}
        onClose={() => {
          console.log(1);
          setIsLeagueModalOpen(false);
        }}
        width={700}
      >
        <LeagueDetails
          onConfirm={(league) => confirmLeague(league, false)}
          onClose={() => setIsLeagueModalOpen(false)}
        />
      </CustomModal>
    </PageContainer>
  );
};

export default LeaguesPage;
