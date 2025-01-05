import { Typography } from '@mui/material';
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
  showAllTeamsAtOnce?: boolean;
  automaticScrolling?: boolean;
}

const ResultsPageLeaderboardList: React.FC<IProps> = ({
  teams,
  className,
  showHeader,
  hideFooter,
  showAllTeamsAtOnce,
}) => {
  const fontSize = 20;

  const columns: GridColDef<LeaderboardTeam>[] = [
    {
      field: 'rank',
      headerName: '',
      width: 40,
      renderCell: (params) => {
        return (
          <Typography
            variant="p1Medium"
            width={30}
            textAlign="center"
            fontSize={fontSize}
          >
            {params?.row?.rank}.
          </Typography>
        );
      },
    },
    {
      field: 'team',
      headerName: 'Team',
      width: 350,
      minWidth: 250,
      maxWidth: 750,
      renderCell: (params) => {
        return (
          <Typography fontSize={fontSize}>
            {params?.row?.team.teamName}
          </Typography>
        );
      },
    },
    {
      field: 'totalPoints',
      headerName: 'Points',
      minWidth: 80,
      maxWidth: 80,
      renderCell: (cell) => {
        return (
          <Typography variant="p1" fontSize={fontSize}>
            {cell.row.totalPoints}
          </Typography>
        );
      },
    },
    {
      field: 'totalWins',
      headerName: 'Wins',
      minWidth: 80,
      maxWidth: 80,
      renderCell: (cell) => {
        return (
          <Typography variant="p1" fontSize={fontSize}>
            {cell.row.totalWins}
          </Typography>
        );
      },
    },
    {
      field: 'totalLosses',
      headerName: 'Losses',
      minWidth: 80,
      maxWidth: 80,
      renderCell: (cell) => {
        return (
          <Typography variant="p1" fontSize={fontSize}>
            {cell.row.totalLosses}
          </Typography>
        );
      },
    },
    {
      field: 'totalDraws',
      headerName: 'Draws',
      minWidth: 80,
      maxWidth: 80,
      renderCell: (cell) => {
        return (
          <Typography variant="p1" fontSize={fontSize}>
            {cell.row.totalDraws}
          </Typography>
        );
      },
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number | null>(null);
  useEffect(() => {
    if (!containerRef?.current) {
      return;
    }
    if (showAllTeamsAtOnce) {
      setRowsPerPage(teams?.length || 0);
      return;
    }
    const containerRefHeight = containerRef.current.offsetHeight;
    const rowHeight = 80;
    const availableRowsPerPage = Math.floor(containerRefHeight / rowHeight);
    setRowsPerPage(availableRowsPerPage || 5);
  }, [showAllTeamsAtOnce, teams?.length]);

  const areRowsPerPageAvailable = rowsPerPage !== null && rowsPerPage > 0;

  return (
    <FlexContainer
      width="100%"
      flexDirection="column"
      className={className}
      height="100%"
      ref={containerRef}
      style={{ overflow: 'hidden' }}
    >
      {!teams?.length && areRowsPerPageAvailable && (
        <Typography
          variant="body2"
          color={(theme) => theme.palette.text.secondary}
        >
          There is currently no leaderboard available.
        </Typography>
      )}
      {(teams?.length! > 0 || (showHeader && !teams?.length)) &&
        areRowsPerPageAvailable && (
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

export default ResultsPageLeaderboardList;
