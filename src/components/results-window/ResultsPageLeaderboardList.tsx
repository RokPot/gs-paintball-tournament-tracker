import { Typography, css, styled } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataTable from 'components/shared/CustomDataTable';
import { useEffect, useRef, useState } from 'react';
import LeaderboardTeam from 'types/LeadeboardTeam';

/**
 * The DataGrid paints its own surfaces, so they have to be cleared for the
 * card tint underneath to show through.
 */
const StyledLeaderboardCard = styled('div', {
  shouldForwardProp: (prop) => prop !== 'tint',
})<{ tint?: string }>(
  ({ tint }) => css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 6px;
    background: ${tint || 'transparent'};

    .MuiDataGrid-root,
    .MuiDataGrid-columnHeaders,
    .MuiDataGrid-virtualScroller,
    .MuiDataGrid-footerContainer,
    .MuiDataGrid-cell {
      background: transparent;
    }
  `,
);

interface IProps {
  teams?: LeaderboardTeam[];
  showHeader?: boolean;
  className?: string;
  hideFooter?: boolean;
  showAllTeamsAtOnce?: boolean;
  automaticScrolling?: boolean;
  /** Narrows the columns so two leaderboards fit side by side. */
  compact?: boolean;
  /** Background wash used to tell adjacent group tables apart. */
  tint?: string;
}

const ResultsPageLeaderboardList: React.FC<IProps> = ({
  teams,
  className,
  showHeader,
  hideFooter,
  showAllTeamsAtOnce,
  compact,
  tint,
}) => {
  const fontSize = compact
    ? 'clamp(1rem, 3.0vh, 2.4rem)'
    : 'clamp(1.1rem, 2.8vh, 2.8rem)';
  const statColumnWidth = compact ? 100 : 120;
  const rowHeight = compact ? 64 : 80;
  const columnHeaderHeight = compact ? 56 : 64;

  const renderHeader = (label: string) => (
    <Typography variant="p1Bold" fontSize={fontSize} lineHeight="1.2em">
      {label}
    </Typography>
  );

  const columns: GridColDef<LeaderboardTeam>[] = [
    {
      field: 'rank',
      headerName: '',
      width: compact ? 56 : 64,
      renderHeader: () => renderHeader(''),
      renderCell: (params) => {
        return (
          <Typography
            variant="p1Medium"
            width={compact ? 40 : 48}
            textAlign="center"
            fontSize={fontSize}
            lineHeight="1.2em"
          >
            {params?.row?.rank}.
          </Typography>
        );
      },
    },
    {
      field: 'team',
      headerName: 'Team',
      renderHeader: () => renderHeader('Team'),
      ...(compact
        ? { flex: 1, minWidth: 140 }
        : { width: 350, minWidth: 250, maxWidth: 750 }),
      renderCell: (params) => {
        return (
          <Typography fontSize={fontSize} lineHeight="1.2em">
            {params?.row?.team.teamName}
          </Typography>
        );
      },
    },
    {
      field: 'totalPoints',
      headerName: 'Points',
      minWidth: statColumnWidth,
      maxWidth: statColumnWidth,
      renderHeader: () => renderHeader('Points'),
      renderCell: (cell) => {
        return (
          <Typography variant="p1" fontSize={fontSize} lineHeight="1.2em">
            {cell.row.totalPoints}
          </Typography>
        );
      },
    },
    {
      field: 'totalWins',
      headerName: 'Wins',
      minWidth: statColumnWidth,
      maxWidth: statColumnWidth,
      renderHeader: () => renderHeader('Wins'),
      renderCell: (cell) => {
        return (
          <Typography variant="p1" fontSize={fontSize} lineHeight="1.2em">
            {cell.row.totalWins}
          </Typography>
        );
      },
    },
    {
      field: 'totalLosses',
      headerName: 'Losses',
      minWidth: statColumnWidth,
      maxWidth: statColumnWidth,
      renderHeader: () => renderHeader('Losses'),
      renderCell: (cell) => {
        return (
          <Typography variant="p1" fontSize={fontSize} lineHeight="1.2em">
            {cell.row.totalLosses}
          </Typography>
        );
      },
    },
    {
      field: 'totalDraws',
      headerName: 'Draws',
      minWidth: statColumnWidth,
      maxWidth: statColumnWidth,
      renderHeader: () => renderHeader('Draws'),
      renderCell: (cell) => {
        return (
          <Typography variant="p1" fontSize={fontSize} lineHeight="1.2em">
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
    const availableRowsPerPage = Math.floor(containerRefHeight / rowHeight);
    setRowsPerPage(availableRowsPerPage || 5);
  }, [showAllTeamsAtOnce, teams?.length, rowHeight]);

  const areRowsPerPageAvailable = rowsPerPage !== null && rowsPerPage > 0;

  return (
    <StyledLeaderboardCard className={className} tint={tint} ref={containerRef}>
      {!teams?.length && areRowsPerPageAvailable && (
        <Typography
          variant="body2"
          fontSize={fontSize}
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
            rowHeight={rowHeight}
            columnHeaderHeight={columnHeaderHeight}
          />
        )}
    </StyledLeaderboardCard>
  );
};

export default ResultsPageLeaderboardList;
