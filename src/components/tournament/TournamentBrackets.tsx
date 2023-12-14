import { Avatar, Theme, Typography, alpha, css, styled } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useState } from 'react';
import League from 'types/League';
import Team from 'types/Team';
import { TournamentType } from 'types/TournamentType';
import { generateGamesForRoundRobin } from 'utils/tournament/roundRobinUtils';
import { generateGamesForEliminationBrackets } from 'utils/tournamentUtils';
import { v4 } from 'uuid';
import { ReactComponent as EmptyState } from '../../../assets/icons/EmptyInbox.svg';
import BracketsContainer from './visualizations/brackets/BracketsContainer';

interface IRoundRobinContainerProps {
  row: number;
  column: number;
  highlight?: boolean;
  isWinner?: boolean;
}

const StyledRoundRobinCell = styled('div')(
  (props: IRoundRobinContainerProps & { theme?: Theme }) => css`
    border: 0.5px solid ${props.theme?.palette.divider};
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px;
    background-color: ${props.row === props.column
      ? `${alpha(
          props.theme?.palette.primary.light || '#000000',
          0.5,
        )} !important`
      : 'inherit'};

    background-color: ${props.highlight
      ? alpha(props.theme?.palette.primary.main || '#000000', 0.1)
      : 'inherit'};
    background-color: ${props.isWinner
      ? alpha(props.theme?.palette.success.main || '#000000', 0.1)
      : alpha(props.theme?.palette.error.main || '#000000', 0.1)};
  `,
);

interface IProps {
  activeLeague: League;
}
function randomColor() {
  const hex = Math.floor(Math.random() * 0xffffff);
  const color = `#${hex.toString(16)}`;

  return color;
}
const TournamentBrackets: React.FC<IProps> = ({ activeLeague }) => {
  const selectedTournament = activeLeague?.activeTournament;
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  if (!selectedTournament || !activeLeague) {
    return null;
  }

  const numberOfTeams = 0;
  const teamss: Team[] = selectedTournament.teams;
  for (let i = 0; i < numberOfTeams; i += 1) {
    const newTeam = new Team({
      _id: v4(),
      id: v4(),
      teamName: `TBD${i + 1}`,
      teamTag: `TBD${i + 1}`,
      color: randomColor(),
    });
    teamss.push(newTeam);
  }
  const { games: roundRobinGames } = generateGamesForRoundRobin(teamss);

  const { games, totalNumberOfRounds } = generateGamesForEliminationBrackets(
    activeLeague?.activeTournament?.teams || [],
  );
  const onMouseEnterCell = (row: number, column: number) => {
    setHoveredColumn(column);
    setHoveredRow(row);
  };
  const onMouseLeaveCell = () => {
    setHoveredColumn(null);
    setHoveredRow(null);
  };

  if (!selectedTournament?.groups?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyState />
        <Typography variant="h3">
          Tournament has not yet been initialized.
        </Typography>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      alignItems="flex-start"
      padding="20px 0px 0px 0px"
    >
      <Typography
        variant="body1"
        color={(theme) => theme.palette.text.disabled}
      >
        Tournament has not yet started. This is jsut a preview.{' '}
      </Typography>
      {selectedTournament.settings.type ===
        TournamentType.singleElimination && (
        <BracketsContainer
          games={games}
          totalNumberOfRounds={totalNumberOfRounds}
        />
      )}
      {selectedTournament.settings.type === TournamentType.roundRobin && (
        <FlexContainer flexDirection="column">
          <Typography variant="h3">Group 1</Typography>
          <FlexContainer flexDirection="row">
            <FlexContainer
              flexDirection="row"
              alignItems="flex-start"
              padding="20px 0px 0px 0px"
            >
              {[...Array(teamss.length + 1)].map((row, columnIndex) => {
                return (
                  <FlexContainer flexDirection="column">
                    {[...Array(teamss.length + 1)].map((row2, rowIndex) => {
                      if (columnIndex === 0 && rowIndex > 0) {
                        return (
                          <StyledRoundRobinCell
                            column={columnIndex}
                            row={rowIndex}
                            highlight={hoveredRow === rowIndex}
                            onMouseEnter={() =>
                              onMouseEnterCell(rowIndex, columnIndex)
                            }
                            onMouseLeave={onMouseLeaveCell}
                          >
                            <Avatar
                              variant="rounded"
                              style={{
                                backgroundColor:
                                  activeLeague?.activeTournament?.teams[
                                    rowIndex - 1
                                  ]?.color,
                                width: '50px',
                                height: '50px',
                                borderRadius: '0px',
                              }}
                            >
                              <Typography
                                variant="p2Medium"
                                style={{ textTransform: 'uppercase' }}
                              >
                                {teamss[rowIndex - 1].teamName}
                              </Typography>
                            </Avatar>
                          </StyledRoundRobinCell>
                        );
                      }
                      if (columnIndex > 0 && rowIndex === 0) {
                        return (
                          <StyledRoundRobinCell
                            column={columnIndex}
                            row={rowIndex}
                            highlight={hoveredColumn === columnIndex}
                            onMouseEnter={() =>
                              onMouseEnterCell(rowIndex, columnIndex)
                            }
                            onMouseLeave={onMouseLeaveCell}
                          >
                            <Avatar
                              variant="rounded"
                              style={{
                                backgroundColor: teamss[columnIndex - 1]?.color,
                                width: '50px',
                                height: '50px',
                                borderRadius: '0px',
                              }}
                            >
                              <Typography
                                variant="p2Medium"
                                style={{ textTransform: 'uppercase' }}
                              >
                                {teamss[columnIndex - 1].teamName}
                              </Typography>
                            </Avatar>
                          </StyledRoundRobinCell>
                        );
                      }
                      if (columnIndex === rowIndex) {
                        return (
                          <StyledRoundRobinCell
                            column={columnIndex}
                            row={rowIndex}
                            highlight={false}
                          />
                        );
                      }
                      const colTeam = teamss[columnIndex - 1];
                      const rowTeam = teamss[rowIndex - 1];
                      const game = roundRobinGames.find(
                        (gme) =>
                          [colTeam?.id, rowTeam?.id].includes(gme.team1.id) &&
                          [colTeam?.id, rowTeam?.id].includes(gme.team2.id),
                      );
                      const isAboveDiagonal =
                        columnIndex !== rowIndex && rowIndex < columnIndex;
                      const firstScore = isAboveDiagonal
                        ? game?.team1Wins
                        : game?.team2Wins;
                      const secondScore = isAboveDiagonal
                        ? game?.team2Wins
                        : game?.team1Wins;
                      const winner = firstScore! > secondScore!;
                      console.log(
                        'game',
                        game?.id,
                        game,
                        isAboveDiagonal,
                        firstScore,
                        secondScore,
                      );
                      return (
                        <StyledRoundRobinCell
                          column={columnIndex}
                          row={rowIndex}
                          onMouseEnter={() =>
                            onMouseEnterCell(rowIndex, columnIndex)
                          }
                          onMouseLeave={onMouseLeaveCell}
                          highlight={
                            hoveredColumn === columnIndex ||
                            hoveredRow === rowIndex
                          }
                          isWinner={winner}
                        >
                          <Typography variant="p1Medium">
                            {`${
                              isAboveDiagonal
                                ? `${game?.team1Wins} - ${game?.team2Wins}`
                                : `${game?.team2Wins} - ${game?.team1Wins}`
                            }`}
                            {/* {game?.team1Wins} - {game?.team2Wins} */}
                          </Typography>
                        </StyledRoundRobinCell>
                      );
                    })}
                  </FlexContainer>
                );
              })}
            </FlexContainer>
            <FlexContainer flexDirection="column">
              <LeaderboardList
                showHeader
                teams={activeLeague?.activeTournament?.leaderboard}
              />
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default TournamentBrackets;
