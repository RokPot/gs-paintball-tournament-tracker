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
import CustomDataTable from 'components/shared/CustomDataTable';
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import PageContainer from 'components/shared/PageContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import QuickAddTeam from 'components/teams/QuickAddTeam';
import AddOrEditTournament from 'components/tournament/AddOrEditTournament';
import TournamentShortList from 'components/tournament/TournamentListShort';
import { useState } from 'react';
import useTeamService from 'services/TeamService';
import useLeagueQueries from 'services/queries/LeagueQueries';
import { createNewLeaderboardTeam } from 'services/queries/TeamQueries';
import useTournamentQueries from 'services/queries/TournamentQueries';
import League from 'types/League';
import Team from 'types/Team';
import Tournament from 'types/Tournament';

const StyledHeaderContainer = styled('div')(
  () => css`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  `,
);

const StyledActiveBadge = styled('div')(
  (props) => css`
    padding: 3px;
    border-radius: 5px;
    -webkit-animation: glow linear 5s infinite;
    animation: glow linear 5s infinite;
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
  `,
);

function LeaguesPage() {
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const [isTeamAddModalOpen, setIsTeamAddModalOpen] = useState(false);
  const [isTournamentAddModalOpen, setIsTournamentAddModalOpen] =
    useState(false);

  const [selectedRowLeague, setSelectedRowLeague] = useState<League>();
  const [editRowLeague, setEditRowLeague] = useState<League>();
  const { addNewTeam, addNewLeaderBoardTeam } = useTeamService();
  const theme = useTheme();

  const {
    leaguesList,
    addLeague,
    invalidateLeaguesList,
    updateExistingLeague,
    deleteExistingLeague,
    isFetchingLeaguesList,
    setSelectedLeague,
    selectedLeague,
  } = useLeagueQueries();

  const { addNewTournamentToLeague } = useTournamentQueries();

  const confirmLeague = async (league: League, isEdit: boolean) => {
    await addLeague(league, isEdit);
    setIsLeagueModalOpen(false);
  };

  const onEditClick = (league: League) => {
    setEditRowLeague(league);
    setIsLeagueModalOpen(true);
  };

  const onRemoveClick = async (league: League) => {
    await deleteExistingLeague(league);
    await invalidateLeaguesList();
  };

  const onToggleActiveClick = async (league: League) => {
    await setSelectedLeague(league, selectedLeague);
  };

  const addNewTournamentInternal = async (tournament: Tournament) => {
    const updatedLeague = await addNewTournamentToLeague(
      tournament,
      selectedRowLeague,
    );

    setSelectedRowLeague(updatedLeague);
    setIsTournamentAddModalOpen(false);
  };

  const addNewTeamInternal = async (team: Team) => {
    if (!selectedRowLeague) {
      return;
    }
    const newTeam = await addNewTeam(team);
    const newLeaderboardTeam = await addNewLeaderBoardTeam(
      createNewLeaderboardTeam(team),
    );
    if (!newTeam || !newLeaderboardTeam) {
      return;
    }
    selectedRowLeague.teams = [...selectedRowLeague.teams, newTeam];
    selectedRowLeague.leaderboard = [
      ...selectedRowLeague.leaderboard,
      newLeaderboardTeam,
    ];
    await updateExistingLeague(selectedRowLeague);

    setIsTeamAddModalOpen(false);
    await invalidateLeaguesList();
    setSelectedRowLeague(selectedRowLeague);
  };

  const columns: GridColDef<League>[] = [
    {
      field: 'isLeagueSelected',
      headerName: '',
      width: 60,
      renderCell: (params) => {
        return (
          params.row?.isLeagueSelected && (
            <StyledActiveBadge>
              <Typography variant="subtitle2">Active</Typography>
            </StyledActiveBadge>
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
                  params.row?.isLeagueSelected
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

  return (
    <PageContainer>
      <StyledHeaderContainer>
        <Typography variant="h4">Leagues</Typography>
        <Button onClick={() => setIsLeagueModalOpen(true)}>
          <Typography variant="body1">Create a new league</Typography>
        </Button>
      </StyledHeaderContainer>

      <CustomDataTable
        loading={isFetchingLeaguesList}
        columns={columns}
        rows={leaguesList || []}
        onRowSelect={(league: League) => setSelectedRowLeague(league)}
      />

      {!selectedRowLeague && (
        <Typography variant="body2" color={theme.palette.text.disabled}>
          No league is selected. Please select one before procceeding
        </Typography>
      )}
      {selectedRowLeague && (
        <>
          <FlexContainer width="100%" margin={8} flexWrap="wrap">
            <Typography variant="h4Medium">
              League - {selectedRowLeague.name}
            </Typography>
            <Button
              variant="text"
              style={{ width: '160px' }}
              onClick={() => onToggleActiveClick(selectedRowLeague)}
            >
              <Typography variant="body1">
                {selectedRowLeague?.id === selectedLeague?.id
                  ? 'Unselect this league'
                  : 'Select this league'}
              </Typography>
            </Button>
          </FlexContainer>

          <FlexContainer width="100%" margin={0} height="100%">
            <FlexContainer
              flexDirection="column"
              width="100%"
              alignItems="flex-start"
              height="100%"
              padding="8px 8px 0px 8px"
              flex={1}
              style={{ borderRight: `1px solid ${theme.palette.divider}` }}
              minWidth="400px"
            >
              <FlexContainer
                justifyContent="space-between"
                width="100%"
                style={{ marginBottom: '0px' }}
              >
                <Typography variant="p1Medium">League tournaments</Typography>
                <Button
                  variant="contained"
                  style={{ width: '140px' }}
                  onClick={() => {
                    setIsTournamentAddModalOpen(true);
                  }}
                >
                  <Typography variant="subtitle2">New tournament</Typography>
                </Button>
              </FlexContainer>
              <TournamentShortList
                tournaments={selectedRowLeague?.tournaments}
              />
            </FlexContainer>
            <FlexContainer
              flexDirection="column"
              width="100%"
              alignItems="flex-start"
              height="100%"
              padding="8px 8px 0px 8px"
              flex={1}
              minWidth="400px"
            >
              <FlexContainer
                justifyContent="space-between"
                width="100%"
                style={{ marginBottom: '0px' }}
              >
                <Typography variant="p1Medium">League leaderboard</Typography>
                <Button
                  variant="contained"
                  style={{ width: '140px' }}
                  onClick={() => {
                    setIsTeamAddModalOpen(true);
                  }}
                >
                  <Typography variant="subtitle2">Create a new team</Typography>
                </Button>
              </FlexContainer>

              <LeaderboardList teams={selectedRowLeague?.leaderboard} />
            </FlexContainer>
          </FlexContainer>
        </>
      )}
      <CustomModal
        isModalOpen={
          isLeagueModalOpen || isTeamAddModalOpen || isTournamentAddModalOpen
        }
        onClose={() => {
          setIsLeagueModalOpen(false);
          setIsTeamAddModalOpen(false);
          setIsTournamentAddModalOpen(false);
        }}
        width={700}
      >
        {isLeagueModalOpen && (
          <LeagueDetails
            league={editRowLeague}
            onConfirm={confirmLeague}
            onClose={() => setIsLeagueModalOpen(false)}
          />
        )}
        {isTeamAddModalOpen && (
          <QuickAddTeam
            onAccept={addNewTeamInternal}
            onCancel={() => setIsTeamAddModalOpen(false)}
          />
        )}
        {isTournamentAddModalOpen && (
          <AddOrEditTournament
            league={selectedRowLeague}
            onAccept={addNewTournamentInternal}
            onCancel={() => setIsTournamentAddModalOpen(false)}
          />
        )}
      </CustomModal>
    </PageContainer>
  );
}

export default LeaguesPage;
