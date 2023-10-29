import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataTable from 'components/shared/CustomDataTable';
import FlexContainer from 'components/shared/FlexContainer';
import { LeaderboardTeam } from 'types/LeadeboardTeam';
import { Team } from 'types/Team';

interface IProps {
  teams?: LeaderboardTeam[];
  className?: string;
  showRemoveButton?: boolean;
  showEditButton?: boolean;
  onEditTeam?: (team: Team, index: number) => void;
  onRemoveTeam?: (team: Team, index: number) => void;
}

const LeaderboardList: React.FC<IProps> = ({
  teams,
  showRemoveButton,
  showEditButton,
  className,
  onRemoveTeam,
}) => {
  const getColor = (index: number) => {
    switch (index) {
      case 0:
        return '#FFD700';
      case 1:
        return '#c0c0c0';
      case 2:
        return '#CD7F32';
    }
  };

  const columns: GridColDef<LeaderboardTeam>[] = [
    {
      field: 'rank',
      headerName: '',
      width: 40,
      renderCell: (params) => {
        return (
          <Typography variant="p1Medium" width={30} textAlign="center">
            {[0, 1, 2, 3].includes(params.row.rank) ? (
              <FontAwesomeIcon
                icon={faTrophy}
                color={getColor(params?.row?.rank)}
                fontSize={20}
              />
            ) : (
              params?.row?.rank + '.'
            )}
          </Typography>
        );
      },
    },
    {
      field: 'team',
      headerName: 'Team',
      minWidth: 150,
      maxWidth: 350,
      renderCell: (params) => {
        return (
          <>
            <Avatar
              variant="rounded"
              style={{
                backgroundColor: params?.row?.color,
                marginRight: '8px',
              }}
            >
              <Typography
                variant="p1Medium"
                style={{ textTransform: 'uppercase' }}
              >
                {params?.row?.teamTag}
              </Typography>
            </Avatar>
            <Typography width={100}>{params?.row?.teamName}</Typography>
          </>
        );
      },
    },
    {
      field: 'totalPoints',
      headerName: 'Total points',
      minWidth: 150,
      maxWidth: 350,
    },
    {
      field: 'totalWins',
      headerName: 'Total wins',
      minWidth: 150,
      maxWidth: 350,
    },
    {
      field: 'totalLosses',
      headerName: 'Total losses',
      minWidth: 150,
      maxWidth: 350,
    },
    {
      field: 'totalDraws',
      headerName: 'Total draws',
      minWidth: 150,
      maxWidth: 350,
    },
  ];

  return (
    <FlexContainer width="100%" flexDirection="column" className={className}>
      <CustomDataTable columns={columns} rows={teams || []} />
      {/* {!teams?.length && (
        <Typography
          variant="body2"
          color={(theme) => theme.palette.text.secondary}
        >
          There are currently no leaderboard.
        </Typography>
      )}
      {teams?.map((team: Team, index: number) => (
        <FlexContainer
          flexDirection="row"
          margin={8}
          padding="8px"
          key={index}
          width="100%"
          highlightRowOnHover
        >
          <Typography variant="p1Medium" width={30} textAlign="center">
            {[0, 1, 2].includes(index) ? (
              <FontAwesomeIcon
                icon={faTrophy}
                color={getColor(index)}
                fontSize={20}
              />
            ) : (
              index + 1 + '.'
            )}
          </Typography>
          <Avatar variant="rounded" style={{ backgroundColor: team.color }}>
            <Typography
              variant="p1Medium"
              style={{ textTransform: 'uppercase' }}
            >
              {team?.teamTag}
            </Typography>
          </Avatar>
          <Typography width={100}>{team?.teamName}</Typography>
          <Typography
            variant="subtitle1"
            color={(theme) => theme.palette.text.secondary}
            width={60}
          >
            21 points
          </Typography>
          <Typography
            variant="subtitle1"
            color={(theme) => theme.palette.text.secondary}
            width={60}
          >
            13 wins
          </Typography>
          <Typography
            variant="subtitle1"
            color={(theme) => theme.palette.text.secondary}
            width={60}
          >
            13 loses
          </Typography>
          <Typography
            variant="subtitle1"
            color={(theme) => theme.palette.text.secondary}
            width={60}
          >
            13 draws
          </Typography>
        </FlexContainer>
      ))} */}
    </FlexContainer>
  );
};

export default LeaderboardList;
