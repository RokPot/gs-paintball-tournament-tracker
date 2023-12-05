import { Avatar, Theme, Typography, alpha, css, styled } from '@mui/material';
import BracketsRoundColumn from 'components/brackets/BracketsRoundColumn';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useState } from 'react';
import League from 'types/League';
import Team from 'types/Team';
import { TournamentType } from 'types/TournamentType';
import { generateGamesForEliminationBrackets } from 'utils/tournamentUtils';
import { v4 } from 'uuid';

interface IRoundRobinContainerProps {
  row: number;
  column: number;
  highlight?: boolean;
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
      ? alpha(props.theme?.palette.primary.light || '#000000', 0.3)
      : 'inherit'};
  `,
);

const StyledRoundRobinTableContainer = styled('div')(
  (props) => css`
    border-right: 1px solid ${props.theme?.palette.divider};
    border-top: 1px solid ${props.theme?.palette.divider};
    display: flex;
    flex-direction: row;
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

  const numberOfTeams = 5;
  const teamss: Team[] = [];
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
  const { games, totalNumberOfRounds } = generateGamesForEliminationBrackets(
    activeLeague?.activeTournament?.teams || [],
  );

  const onMouseEnterCell = (row: number, column: number) => {
    console.log('Mouse entered a cell', row, column);
    console.log('Row', row, column);
    console.log('Mouse entered a cell', row, column);
    setHoveredColumn(column);
    setHoveredRow(row);
  };
  const onMouseLeaveCell = (row: number, column: number) => {
    console.log('Mouse left a cell', row, column);
    setHoveredColumn(null);
    setHoveredRow(null);
  };
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
        <FlexContainer
          flexDirection="row"
          alignItems="flex-start"
          padding="20px 0px 0px 0px"
        >
          {[...Array(totalNumberOfRounds)].map((val, index) => {
            return (
              <BracketsRoundColumn
                isLastRound={index + 1 === totalNumberOfRounds}
                currentRoundGames={games.filter(
                  (game) => game.bracketProperties?.round === index,
                )}
                round={index}
              />
            );
          })}
        </FlexContainer>
      )}
      {selectedTournament.settings.type === TournamentType.roundRobin && (
        <FlexContainer flexDirection="column">
          <FlexContainer flexDirection="row">
            <FlexContainer
              flexDirection="row"
              alignItems="flex-start"
              padding="20px 0px 0px 0px"
            >
              {[...Array(numberOfTeams + 1)].map((row, columnIndex) => {
                return (
                  <FlexContainer flexDirection="column">
                    {[...Array(numberOfTeams + 1)].map((row, rowIndex) => {
                      if (columnIndex === 0 && rowIndex === 0) {
                        return (
                          <StyledRoundRobinCell
                            column={columnIndex}
                            row={rowIndex}
                          />
                        );
                      }
                      if (columnIndex === 0 && rowIndex > 0) {
                        return (
                          <StyledRoundRobinCell
                            column={columnIndex}
                            row={rowIndex}
                            highlight={hoveredRow === rowIndex}
                            onMouseEnter={() =>
                              onMouseEnterCell(rowIndex, columnIndex)
                            }
                            onMouseLeave={() =>
                              onMouseLeaveCell(rowIndex, columnIndex)
                            }
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
                                {
                                  activeLeague?.activeTournament?.teams[
                                    rowIndex - 1
                                  ].teamName
                                }
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
                            onMouseLeave={() =>
                              onMouseLeaveCell(rowIndex, columnIndex)
                            }
                          >
                            <Avatar
                              variant="rounded"
                              style={{
                                backgroundColor:
                                  activeLeague?.activeTournament?.teams[
                                    columnIndex - 1
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
                                {
                                  activeLeague?.activeTournament?.teams[
                                    columnIndex - 1
                                  ].teamName
                                }
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
                      return (
                        <StyledRoundRobinCell
                          column={columnIndex}
                          row={rowIndex}
                          onMouseEnter={() =>
                            onMouseEnterCell(rowIndex, columnIndex)
                          }
                          onMouseLeave={() =>
                            onMouseLeaveCell(rowIndex, columnIndex)
                          }
                          highlight={
                            hoveredColumn === columnIndex ||
                            hoveredRow === rowIndex
                          }
                        >
                          <Typography variant="p2Medium">
                            {columnIndex} - {rowIndex}
                          </Typography>
                        </StyledRoundRobinCell>
                      );
                    })}{' '}
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
