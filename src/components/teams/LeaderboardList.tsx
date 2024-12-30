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
  showAllTeamsAtOnce?: boolean;
  automaticScrolling?: boolean;
}

const LeaderboardList: React.FC<IProps> = ({
  teams,
  className,
  showHeader,
  hideFooter,
  showAllTeamsAtOnce,
}) => {
  const getColor = (index: number) => {
    switch (index) {
      case 1:
        return '#FFD800';
      case 2:
        return '#c0c0c0';
      case 3:
        return '#CD7F32';
      default:
        return '#172032';
    }
  };

  const getInitialsFromText = (text: string) => {
    if (!text) {
      return '';
    }

    const splitText = text.split(' ');

    if (splitText.length === 1 && text.length < 6) {
      return text;
    }

    let output = '';
    let i = 0;
    const len = splitText.length;

    for (i; i < len; i += 1) {
      if (splitText[i] !== '') {
        output += splitText[i][0];
      }
    }
    return output;
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
      minWidth: 250,
      maxWidth: 550,
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
                variant="p3Medium"
                style={{ textTransform: 'uppercase' }}
              >
                {getInitialsFromText(params?.row?.team.teamTag)}
              </Typography>
            </Avatar>
            <Typography width={100}>{params?.row?.team.teamName}</Typography>
          </>
        );
      },
    },
    {
      field: 'totalPoints',
      headerName: 'Points',
      minWidth: 80,
      maxWidth: 80,
    },
    {
      field: 'totalWins',
      headerName: 'Wins',
      minWidth: 80,
      maxWidth: 80,
    },
    {
      field: 'totalLosses',
      headerName: 'Losses',
      minWidth: 80,
      maxWidth: 80,
    },
    {
      field: 'totalDraws',
      headerName: 'Draws',
      minWidth: 80,
      maxWidth: 80,
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
    const containerRefHeight =
      containerRef.current.offsetHeight - (hideFooter ? 0 : 60);
    const rowHeight = 60;
    const availableRowsPerPage = Math.floor(containerRefHeight / rowHeight);
    setRowsPerPage(availableRowsPerPage || 5);
  }, [hideFooter, showAllTeamsAtOnce, teams?.length]);

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

export default LeaderboardList;
