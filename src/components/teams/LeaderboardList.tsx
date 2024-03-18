import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataTable from 'components/shared/CustomDataTable';
import FlexContainer from 'components/shared/FlexContainer';
import { useEffect, useRef, useState } from 'react';
import LeaderboardTeam from 'types/LeadeboardTeam';

interface IProps {
  teams?: LeaderboardTeam[];
  showHeader?: boolean;
  className?: string;
  hideFooter?: boolean;
}

const LeaderboardList: React.FC<IProps> = ({
  teams,
  className,
  showHeader,
  hideFooter,
}) => {
  const getColor = (index: number) => {
    switch (index) {
      case 1:
        return '#FFD700';
      case 2:
        return '#c0c0c0';
      case 3:
        return '#CD7F32';
      default:
        return '#172032';
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
            {[1, 2, 3].includes(params.row.rank) ? (
              <FontAwesomeIcon
                icon={faTrophy}
                color={getColor(params?.row?.rank)}
                fontSize={20}
              />
            ) : (
              `${params?.row?.rank}.`
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
                backgroundColor: params?.row?.team?.color,
                marginRight: '8px',
              }}
            >
              <Typography
                variant="p1Medium"
                style={{ textTransform: 'uppercase' }}
              >
                {params?.row?.team.teamTag}
              </Typography>
            </Avatar>
            <Typography width={100}>{params?.row?.team.teamName}</Typography>
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
    <FlexContainer
      width="100%"
      flexDirection="column"
      className={className}
      height="100%"
      ref={containerRef}
    >
      {!teams?.length && (
        <Typography
          variant="body2"
          color={(theme) => theme.palette.text.secondary}
        >
          There is currently no leaderboard available.
        </Typography>
      )}
      {(teams?.length! > 0 || (showHeader && !teams?.length)) &&
        rowsPerPage !== null &&
        rowsPerPage > 0 && (
          <CustomDataTable
            height="100%"
            columns={columns}
            rows={teams || []}
            pageSize={rowsPerPage}
            hideFooter={hideFooter}
          />
        )}
    </FlexContainer>
  );
};

export default LeaderboardList;
