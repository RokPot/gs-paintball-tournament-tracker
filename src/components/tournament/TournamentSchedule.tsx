import { Typography, alpha, css, styled, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { compact } from 'lodash';
import { useEffect, useState } from 'react';
import Game from 'types/Game';
import { GameState } from 'types/GameState';
import League from 'types/League';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentSchedule as Schedule } from 'types/TournamentSchedule';
import {
  getNextGame,
  getNextGamePair,
  getNextGroup,
} from 'utils/tournamentFlowUtils';
import { v4 } from 'uuid';
import { ReactComponent as EmptyState } from '../../../assets/icons/EmptyInbox.svg';

const StyledGameContainer = styled('div')(
  (props) => css`
    /* border: solid 1px ${props.theme.palette.divider}; */
    padding: 8px;
    border-radius: 3px;
    box-shadow: 0px 0px 5px 0px ${alpha(props.theme.palette.primary.light, 0.4)};
    width: 100%;
    &:hover {
      background: ${props.theme.palette.grey[200]};
    }
  `,
);

interface IProps {
  activeLeague: League;
}

const TournamentSchedule = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const theme = useTheme();
  const switchGroups = true;
  const switchGames = false;
  console.log(selectedTournament);
  const generateSchedule = () => {
    if (!selectedTournament?.groups?.length) {
      return;
    }
    const groups = [
      ...(JSON.parse(
        JSON.stringify(
          selectedTournament.groups.filter((group) => group.stage === 1),
        ),
      ) as TournamentGroup[]),
    ];
    const totalGames = groups.reduce((prev, curr) => {
      return prev + (curr?.games?.length || 0);
    }, 0);

    let mostCurrentGroup = groups.filter((group) => group.stage === 1)[0];
    let currentGameNumber = 0;
    let pairedGame1: Game = mostCurrentGroup.games[0];
    let pairedGame2: Game | null = switchGames
      ? mostCurrentGroup.games[1]
      : null;
    mostCurrentGroup.games[0].gameState = GameState.finished;
    if (switchGames) {
      mostCurrentGroup.games[1].gameState = GameState.finished;
    }
    const games: Schedule[] = compact([
      pairedGame1 &&
        ({
          game: pairedGame1,
          gameNumber: 1,
          groupId: mostCurrentGroup,
          id: v4(),
        } as Schedule),
      pairedGame2 &&
        ({
          game: pairedGame2,
          gameNumber: 2,
          groupId: mostCurrentGroup,
          id: v4(),
        } as Schedule),
    ]);
    currentGameNumber = games.length + 1;
    while (games.length < totalGames) {
      const newGroup = getNextGroup(mostCurrentGroup, groups, 1, switchGroups);
      if (!newGroup) {
        break;
      }
      mostCurrentGroup = newGroup;
      if (switchGames) {
        const gamePair = getNextGamePair(mostCurrentGroup);
        if (!gamePair) {
          const gamePair1 = getNextGamePair(mostCurrentGroup);
          break;
        }

        if (gamePair.game1) {
          pairedGame1 = gamePair.game1;
          pairedGame1.gameState = GameState.finished;
          games.push({
            game: pairedGame1,
            gameNumber: currentGameNumber,
            groupId: mostCurrentGroup,
            id: v4(),
          });
          currentGameNumber += 1;
        }

        if (gamePair.game2) {
          pairedGame2 = gamePair.game2;
          pairedGame2.gameState = GameState.finished;
          games.push({
            game: pairedGame2,
            gameNumber: currentGameNumber,
            groupId: mostCurrentGroup,
            id: v4(),
          });
          currentGameNumber += 1;
        }
      } else {
        const gamePair = getNextGame(mostCurrentGroup);
        if (!gamePair) {
          break;
        }

        if (gamePair.game1) {
          pairedGame1 = gamePair.game1;
          pairedGame1.gameState = GameState.finished;
          games.push({
            game: pairedGame1,
            gameNumber: currentGameNumber,
            groupId: mostCurrentGroup,
            id: v4(),
          });
          currentGameNumber += 1;
        }
      }
    }
    setSchedule(games);
  };

  useEffect(() => {
    generateSchedule();
  }, []);
  console.log(schedule);
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
      justifyContent="flex-start"
      alignItems="flex-start"
      gap={8}
    >
      {schedule?.map((sched, index) => {
        const isPreviousGroupDifferent =
          index > 0 &&
          schedule[index - 1].groupId.groupIndex !==
            schedule[index].groupId.groupIndex;

        const isFirstRow = index === 0;
        const shouldPairGames =
          !isPreviousGroupDifferent && index % (switchGames ? 2 : 1) === 0;
        return (
          <>
            {index > 0 && index % 2 === 0 && (
              <div
                style={{
                  borderBottom: `0.5px solid ${theme.palette.primary.light}`,
                  width: '100%',
                  height: '1px',
                }}
              />
            )}
            <FlexContainer flexDirection="column" width="100%">
              {(isPreviousGroupDifferent || isFirstRow || shouldPairGames) && (
                <Typography variant="p1Medium" textAlign="start" width="100%">
                  {(isPreviousGroupDifferent || isFirstRow) &&
                    `Group${sched.groupId.groupIndex}`}
                </Typography>
              )}
              <StyledGameContainer>
                <FlexContainer alignItems="center" width="100%" height="100%">
                  <Typography variant="h5Medium" textAlign="end">
                    Game: {sched.gameNumber}
                  </Typography>
                  <Typography variant="p1">1</Typography>
                  <Typography variant="p1">
                    {sched.game.team1.teamName} VS {sched.game.team2.teamName}
                  </Typography>
                  <Typography variant="p1">2</Typography>
                </FlexContainer>
              </StyledGameContainer>
            </FlexContainer>
          </>
        );
      })}
    </FlexContainer>
  );
};

export default TournamentSchedule;
