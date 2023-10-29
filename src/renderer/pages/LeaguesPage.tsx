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
import TournamentShortList from 'components/tournament/TournamentListShort';
import { useState } from 'react';
import useLeagueStore from 'store/LeagueStore';
import { League } from 'types/League';
import { Team } from 'types/Team';
import { Tournament } from 'types/Tournament';
import { TournamentStage } from 'types/TournamentStage';
import { TournamentState } from 'types/TournamentState';

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
  const {
    setSelectedLeague,
    addLeague,
    updateSelectedLeague,
    updateLeague,
    addTeamToLeague,
    allLeagues,
    selectedLeague,
  } = useLeagueStore();
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const [selectedRowLeague, setSelectedRowLeague] = useState<League>();
  const [isTeamAddModalOpen, setIsTeamAddModalOpen] = useState(false);

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
  const tournaments: Tournament[] = [
    {
      name: 'Tournament 1',
      startDate: new Date(),
      endDate: new Date(),
      groups: [
        {
          games: [],
          groupIndex: 0,
          id: '',
          teams: [
            new Team({
              id: '1',
              members: [],
              teamName: 'team1',
              teamTag: 'tag1',
              draw: 0,
              loses: 0,
              wins: 0,
            }),
            new Team({
              id: '2',
              members: [],
              teamName: 'team2',
              teamTag: 'tag2',
              draw: 0,
              loses: 0,
              wins: 0,
            }),
            new Team({
              id: '3',
              members: [],
              teamName: 'team3',
              teamTag: 'tag3',
              draw: 0,
              loses: 0,
              wins: 0,
            }),
          ],
        },
      ],
      id: '',
      state: new TournamentState({
        id: '',
        isGameInProgress: false,
        isTournamentFinished: false,
        stage: TournamentStage.startStage,
      }),
      teams: [
        new Team({
          id: '1',
          members: [],
          teamName: 'team1',
          teamTag: 'tag1',
          draw: 0,
          loses: 0,
          wins: 0,
        }),
        new Team({
          id: '2',
          members: [],
          teamName: 'team2',
          teamTag: 'tag2',
          draw: 0,
          loses: 0,
          wins: 0,
        }),
        new Team({
          id: '3',
          members: [],
          teamName: 'team3',
          teamTag: 'tag3',
          draw: 0,
          loses: 0,
          wins: 0,
        }),
      ],
    },
    {
      name: 'Tournament 2',
      startDate: new Date(),
      groups: [
        {
          games: [],
          groupIndex: 0,
          id: '',
          teams: [
            new Team({
              id: '1',
              members: [],
              teamName: 'team1',
              teamTag: 'tag1',
              draw: 0,
              loses: 0,
              wins: 0,
            }),
            new Team({
              id: '2',
              members: [],
              teamName: 'team2',
              teamTag: 'tag2',
              draw: 0,
              loses: 0,
              wins: 0,
            }),
            new Team({
              id: '3',
              members: [],
              teamName: 'team3',
              teamTag: 'tag3',
              draw: 0,
              loses: 0,
              wins: 0,
            }),
          ],
        },
      ],
      id: '',
      state: new TournamentState({
        id: '',
        isGameInProgress: false,
        isTournamentFinished: false,
        stage: TournamentStage.startStage,
      }),
      teams: [
        new Team({
          id: '1',
          members: [],
          teamName: 'team1',
          teamTag: 'tag1',
          draw: 0,
          loses: 0,
          wins: 0,
        }),
        new Team({
          id: '2',
          members: [],
          teamName: 'team2',
          teamTag: 'tag2',
          draw: 0,
          loses: 0,
          wins: 0,
        }),
        new Team({
          id: '3',
          members: [],
          teamName: 'team3',
          teamTag: 'tag3',
          draw: 0,
          loses: 0,
          wins: 0,
        }),
      ],
    },
    {
      endDate: new Date(),
      startDate: new Date(),
      name: 'Tournament 3',
      groups: [
        {
          games: [],
          groupIndex: 0,
          id: '',
          teams: [
            new Team({
              id: '1',
              members: [],
              teamName: 'team1',
              teamTag: 'tag1',
              draw: 0,
              loses: 0,
              wins: 0,
            }),
            new Team({
              id: '2',
              members: [],
              teamName: 'team2',
              teamTag: 'tag2',
              draw: 0,
              loses: 0,
              wins: 0,
            }),
            new Team({
              id: '3',
              members: [],
              teamName: 'team3',
              teamTag: 'tag3',
              draw: 0,
              loses: 0,
              wins: 0,
            }),
          ],
        },
      ],
      id: '',
      state: new TournamentState({
        id: '',
        isGameInProgress: false,
        isTournamentFinished: false,
        stage: TournamentStage.startStage,
      }),
      teams: [
        new Team({
          id: '1',
          members: [],
          teamName: 'team1',
          teamTag: 'tag1',
          draw: 0,
          loses: 0,
          wins: 0,
        }),
        new Team({
          id: '2',
          members: [],
          teamName: 'team2',
          teamTag: 'tag2',
          draw: 0,
          loses: 0,
          wins: 0,
        }),
        new Team({
          id: '3',
          members: [],
          teamName: 'team3',
          teamTag: 'tag3',
          draw: 0,
          loses: 0,
          wins: 0,
        }),
      ],
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
              padding="8px"
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
                  onClick={() => {}}
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
              padding="8px"
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
      <CustomModal
        isModalOpen={isTeamAddModalOpen}
        onClose={() => setIsTeamAddModalOpen(false)}
        width={600}
      >
        <QuickAddTeam
          onAccept={(team) => {
            if (!selectedRowLeague) {
              return;
            }
            addTeamToLeague(selectedRowLeague, team);
            setIsTeamAddModalOpen(false);
          }}
          onCancel={() => setIsTeamAddModalOpen(false)}
        />
      </CustomModal>
    </PageContainer>
  );
};

export default LeaguesPage;
