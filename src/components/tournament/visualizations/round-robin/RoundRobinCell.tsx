import {
  Avatar,
  Theme,
  Typography,
  alpha,
  css,
  styled,
  useTheme,
} from '@mui/material';
import { useMemo } from 'react';
import Team from 'types/Team';
import TournamentGroup from 'types/TournamentGroup';

interface IRoundRobinContainerProps {
  backgroundCellColor?: string;
}

const StyledRoundRobinCell = styled('div')(
  (props: IRoundRobinContainerProps & { theme?: Theme }) => css`
    border: 0.5px solid ${props.theme?.palette.divider};
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px;

    ${props.backgroundCellColor && props.backgroundCellColor !== 'inherit'
      ? `background-color: ${props.backgroundCellColor};`
      : ''};
  `,
);

interface IRoundRobinGameCellProps {
  rowIndex: number;
  columnIndex: number;
  hoveredRowIndex?: number;
  hoveredColumnIndex?: number;
  group: TournamentGroup;
  onMouseEnterCell?: (rowIndex: number, cellIndex: number) => void;
  onMouseLeaveCell?: () => void;
}

export const RoundRobinGameCell: React.FC<IRoundRobinGameCellProps> = ({
  columnIndex,
  rowIndex,
  hoveredColumnIndex,
  hoveredRowIndex,
  onMouseEnterCell,
  onMouseLeaveCell,
  group,
}) => {
  const theme = useTheme();
  const { teams, games } = group;

  const cellGameData = useMemo(() => {
    const columnTeam = teams[columnIndex - 1];
    const rowTeam = teams[rowIndex - 1];
    const game = games.find(
      (gme) =>
        [columnTeam?.id, rowTeam?.id].includes(gme.team1.id) &&
        [columnTeam?.id, rowTeam?.id].includes(gme.team2.id),
    );
    const isCellAboveDiagonal =
      columnIndex !== rowIndex && rowIndex < columnIndex;

    const firstTeamScore = isCellAboveDiagonal
      ? game?.team1Wins
      : game?.team2Wins;
    const secondTeamScore = isCellAboveDiagonal
      ? game?.team2Wins
      : game?.team1Wins;
    const isFirstTeamWinner = firstTeamScore! > secondTeamScore!;
    const hasNotPlayedYet = firstTeamScore === 0 && secondTeamScore === 0;

    let backgroundColor = isFirstTeamWinner
      ? alpha(theme.palette.success.main, 0.1)
      : alpha(theme?.palette.error.main, 0.1);

    const isHoveringOver =
      hoveredColumnIndex === columnIndex || hoveredRowIndex === rowIndex;
    if (hasNotPlayedYet) {
      const { '200': grey200 } = theme.palette.grey;
      backgroundColor = grey200;
    }
    if (isHoveringOver) {
      backgroundColor = alpha(backgroundColor, 0.3);
    }

    return { firstTeamScore, secondTeamScore, backgroundColor };
  }, [
    columnIndex,
    games,
    hoveredColumnIndex,
    hoveredRowIndex,
    rowIndex,
    teams,
    theme.palette.error.main,
    theme.palette.grey,
    theme.palette.success.main,
  ]);
  return (
    <StyledRoundRobinCell
      onMouseEnter={() => onMouseEnterCell?.(rowIndex, columnIndex)}
      onMouseLeave={() => onMouseLeaveCell?.()}
      backgroundCellColor={cellGameData.backgroundColor}
    >
      <Typography variant="p1Medium">
        {cellGameData.firstTeamScore} - {cellGameData.secondTeamScore}
      </Typography>
    </StyledRoundRobinCell>
  );
};

interface IRoundRobinTeamCellProps {
  rowIndex: number;
  columnIndex: number;
  team: Team;
  onMouseEnterCell?: (rowIndex: number, cellIndex: number) => void;
  onMouseLeaveCell?: () => void;
}

export const RoundRobinTeamCell: React.FC<IRoundRobinTeamCellProps> = ({
  columnIndex,
  rowIndex,
  team,
  onMouseEnterCell,
  onMouseLeaveCell,
}) => {
  return (
    <StyledRoundRobinCell
      onMouseEnter={() => onMouseEnterCell?.(rowIndex, columnIndex)}
      onMouseLeave={() => onMouseLeaveCell?.()}
    >
      <Avatar
        variant="rounded"
        style={{
          backgroundColor: team?.color,
          width: '50px',
          height: '50px',
          borderRadius: '0px',
        }}
      >
        <Typography variant="p2Medium" style={{ textTransform: 'uppercase' }}>
          {team.teamName}
        </Typography>
      </Avatar>
    </StyledRoundRobinCell>
  );
};

interface IRoundRobinBlankCellProps {}

export const RoundRobinBlankCell: React.FC<IRoundRobinBlankCellProps> = () => {
  const theme = useTheme();
  return (
    <StyledRoundRobinCell
      backgroundCellColor={alpha(theme.palette.primary.light, 0.5)}
    />
  );
};
