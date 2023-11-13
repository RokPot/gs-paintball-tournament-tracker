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
import AddTournament from 'components/tournament/AddTournament';
import TournamentShortList from 'components/tournament/TournamentListShort';
import { useEffect, useState } from 'react';
import useLeagueService from 'services/LeagueService';
import useTeamService from 'services/TeamService';
import useTournamentService from 'services/TournamentService';
import useLeagueStore from 'store/LeagueStore';
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
  `
);

const LeaguesPage: React.FC = () => {
  const { setLeagues, allLeagues, setSelectedLeague, selectedLeague } =
    useLeagueStore();
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const [selectedRowLeague, setSelectedRowLeague] = useState<League>();
  const [isTeamAddModalOpen, setIsTeamAddModalOpen] = useState(false);
  const [isTournamentAddModalOpen, setIsTournamentAddModalOpen] =
    useState(false);
  const { addNewLeague, getLeagues, updateLeague } = useLeagueService();
  const { addNewTeam, addNewLeaderBoardTeam } = useTeamService();
  const { addNewTournament, getTournaments } = useTournamentService();
  const theme = useTheme();

  useEffect(() => {
    const getAllLeagues = async () => {
      const tournaments = await getTournaments();
      setLeagues(await getLeagues());
    };
    getAllLeagues();
  }, []);

  const confirmLeague = async (league: League, isEdit: boolean) => {
    await addNewLeaderBoardTeam(league.leaderboard);
    await addNewLeague(league);

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

  return (
    <PageContainer>
      <StyledHeaderContainer>
        <Typography variant="h4">Leagues</Typography>
        <Button onClick={() => setIsLeagueModalOpen(true)}>
          <Typography variant="body1">Create a new league</Typography>
        </Button>
      </StyledHeaderContainer>

      <CustomDataTable
        columns={columns}
        rows={allLeagues}
        onRowSelect={(league: League) => setSelectedRowLeague(league)}
      />

      {!selectedRowLeague && (
        <>
          <Typography
            variant="body2"
            color={(theme) => theme.palette.text.disabled}
          >
            No league is selected. Please select one before procceeding
          </Typography>
        </>
      )}
      {selectedRowLeague && (
        <>
          <FlexContainer width="100%" margin={8}>
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
              style={{ borderRight: `1px solid ${theme.palette.divider}` }}
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
        isModalOpen={isLeagueModalOpen}
        onClose={() => {
          setIsLeagueModalOpen(false);
        }}
        width={700}
      >
        <LeagueDetails
          onConfirm={(league) => confirmLeague(league, false)}
          onClose={() => setIsLeagueModalOpen(false)}
        />
      </CustomModal>
      <CustomModal
        isModalOpen={isTeamAddModalOpen}
        onClose={() => setIsTeamAddModalOpen(false)}
        width={600}
      >
        <QuickAddTeam
          onAccept={async (team) => {
            if (!selectedRowLeague) {
              return;
            }
            await addNewTeam(team);
            setIsTeamAddModalOpen(false);
          }}
          onCancel={() => setIsTeamAddModalOpen(false)}
        />
      </CustomModal>
      <CustomModal
        isModalOpen={isTournamentAddModalOpen}
        onClose={() => setIsTournamentAddModalOpen(false)}
        width={600}
      >
        <AddTournament
          league={selectedRowLeague}
          onAccept={async (tournament) => {
            if (!selectedRowLeague) {
              return;
            }
            const newTournament = await addNewTournament(tournament.toDto());
            if (!newTournament) {
              return;
            }
            selectedRowLeague.tournaments = [
              ...selectedRowLeague.tournaments,
              newTournament,
            ];
            await updateLeague(selectedRowLeague);
            const tasdsd = await getTournaments();
            // setIsTournamentAddModalOpen(false);
          }}
          onCancel={() => setIsTournamentAddModalOpen(false)}
        />
      </CustomModal>
    </PageContainer>
  );
};

export default LeaguesPage;
