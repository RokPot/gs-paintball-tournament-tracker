import {
  faCheckToSlot,
  faListDots,
  faRemove,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  IconButton,
  Typography,
  css,
  styled,
  useTheme,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import LeagueDetails from 'components/leagues/LeagueDetails';
import DataTable from 'components/leagues/LeaguesTable';
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import PageContainer from 'components/shared/PageContainer';
import { useState } from 'react';
import useGlobalStore from 'store/GlobalStore';
import { League } from 'types/League';

const StyledHeaderContainer = styled('div')(
  () => css`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  `
);

const StyledDivider = styled('div')(
  (props) => css`
    width: 1px;
    height: 100%;
    background-color: ${props.theme.palette.grey[200]};
  `
);

const StyledActiveBadge = styled('div')(
  (props) => css`
    padding: 3px;
    border-radius: 5px;
    -webkit-animation: glow linear 3s infinite;
    animation: glow linear 3s infinite;
    @-webkit-keyframes glow {
      0% {
        background-color: transparent;
      }
      50% {
        background-color: ${props.theme.palette.success.light};
      }
      100% {
        background-color: transparent;
      }
    }
    @keyframes glow {
      0% {
        background-color: transparent;
      }
      50% {
        background-color: ${props.theme.palette.success.light};
      }
      100% {
        background-color: transparent;
      }
    }
  `
);

const LeaguesPage: React.FC = () => {
  const {
    setSelectedLeague,
    addLeague,
    updateSelectedLeague,
    allLeagues,
    selectedLeague,
  } = useGlobalStore();
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);

  const theme = useTheme();

  const confirmLeague = (league: League, isEdit: boolean) => {
    if (isEdit) {
      updateSelectedLeague(league);
    } else {
      addLeague(league);
    }
    setIsLeagueModalOpen(false);
  };
  const onEditClick = (league: League) => {
    console.log(league);
  };
  const onRemoveClick = (league: League) => {
    console.log(league);
  };
  const onToggleActiveClick = (league: League) => {
    setSelectedLeague(selectedLeague?.id === league.id ? undefined : league);
  };
  const columns: GridColDef<League>[] = [
    {
      field: 'isLeagueSelected',
      headerName: '',
      width: 50,
      renderCell: (params) => {
        return (
          params.row?.isLeagueSelected && (
            <StyledActiveBadge>Active</StyledActiveBadge>
          )
        );
      },
    },
    {
      field: 'name',
      headerName: 'League name',
      minWidth: 150,
      maxWidth: 350,
    },
    {
      field: 'teams',
      headerName: '# of Participating teams',
      width: 200,
      valueGetter: (params) => `${params?.row?.teams?.length || 0}`,
    },
    {
      field: 'tournaments',
      headerName: '# of Tournaments',
      flex: 1,
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
              onClick={() => onRemoveClick(params.row)}
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
              onClick={() => onToggleActiveClick(params.row)}
              style={{ height: '30px' }}
            >
              <FontAwesomeIcon
                icon={faCheckToSlot}
                width={15}
                height={15}
                color={
                  selectedLeague?.id === params.row.id
                    ? theme.palette.error.dark
                    : theme.palette.success.dark
                }
              />
            </IconButton>
          </FlexContainer>
        );
      },
    },
  ];
  console.log(selectedLeague, allLeagues);
  return (
    <PageContainer>
      <StyledHeaderContainer>
        <Typography variant="h4">Leagues</Typography>
        <Button onClick={() => setIsLeagueModalOpen(true)}>
          <Typography variant="body1">Create a new league</Typography>
        </Button>
      </StyledHeaderContainer>

      <DataTable columns={columns} rows={allLeagues} />
      {!selectedLeague && (
        <>
          <Typography>
            No league is selected. Please select one before procceeding
          </Typography>
        </>
      )}
      {selectedLeague && (
        <>
          <Typography variant="h4Medium">{selectedLeague.name}</Typography>
          <FlexContainer width="100%" margin={0} height="100%">
            <FlexContainer
              flexDirection="column"
              width="100%"
              alignItems="flex-start"
              height="100%"
              padding="8px"
            >
              <Typography variant="p1Medium">League tournaments</Typography>
            </FlexContainer>
            <StyledDivider />
            <FlexContainer
              flexDirection="column"
              width="100%"
              alignItems="flex-start"
              height="100%"
              padding="8px"
            >
              <Typography variant="p1Medium">League teams</Typography>
              <FlexContainer></FlexContainer>
            </FlexContainer>
          </FlexContainer>
        </>
      )}
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
