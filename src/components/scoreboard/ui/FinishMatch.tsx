import { Button, Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { useCallback, useState } from 'react';
import Game from 'types/Game';
import { Match } from 'types/Match';
import MatchState from 'types/MatchState';

interface IProps {
  game?: Game;
  shouldInsertTeamsMargins?: boolean;
  forceInsert?: boolean;
  onMatchFinished: (match: Match) => void;
  sizeOfTeams?: number;
}

const FinishMatch: React.FC<IProps> = ({
  game,
  forceInsert,
  shouldInsertTeamsMargins,
  sizeOfTeams,
  onMatchFinished,
}) => {
  const [matchState, setMatchState] = useState<MatchState>();
  const [team1Margin, setTeam1Margin] = useState(0);
  const [team2Margin, setTeam2Margin] = useState(0);
  console.log(sizeOfTeams);
  const finishMatch = useCallback(() => {
    if (!matchState) {
      return;
    }
    const newMatchFinished: Match = {
      id: 'asd',
      matchState,
      team1Margin,
      team2Margin,
      matchDurationInSeconds: 123,
    };
    onMatchFinished(newMatchFinished);
  }, [matchState, onMatchFinished, team1Margin, team2Margin]);

  if (!game) {
    return (
      <FlexContainer
        padding="16px"
        flexDirection="column"
        alignItems="flex-start"
        gap={16}
        width="100%"
      >
        <Typography variant="caption">
          No game was found, please try again.
        </Typography>
      </FlexContainer>
    );
  }
  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      alignItems="flex-start"
      gap={16}
    >
      <Typography variant="h4">Finish Match</Typography>
      <FlexContainer flexDirection="row" gap={8} width="100%">
        <Button
          variant={
            matchState === MatchState.team1Win ? 'contained' : 'outlined'
          }
          color={matchState === MatchState.team1Win ? 'warning' : 'primary'}
          style={{ width: '100%' }}
          onClick={() => setMatchState(MatchState.team1Win)}
        >
          <Typography variant="p1Medium">
            <Typography
              variant="p1Medium"
              style={{ textDecoration: 'underline' }}
            >
              {game.team1.teamName}
            </Typography>{' '}
            Wins
          </Typography>
        </Button>
        <Button
          variant={matchState === MatchState.draw ? 'contained' : 'outlined'}
          color={matchState === MatchState.draw ? 'warning' : 'primary'}
          onClick={() => setMatchState(MatchState.draw)}
        >
          <Typography variant="p1Medium">Draw</Typography>
        </Button>
        <Button
          variant={
            matchState === MatchState.team2Win ? 'contained' : 'outlined'
          }
          color={matchState === MatchState.team2Win ? 'warning' : 'primary'}
          style={{ width: '100%' }}
          onClick={() => setMatchState(MatchState.team2Win)}
        >
          <Typography variant="p1Medium">
            <Typography
              variant="p1Medium"
              style={{ textDecoration: 'underline' }}
            >
              {game.team2.teamName}
            </Typography>{' '}
            Wins
          </Typography>
        </Button>
      </FlexContainer>
      <FlexContainer flexDirection="row" width="100%" justifyContent="center">
        <FlexContainer flexDirection="column">
          <Typography variant="p1Medium">Team 1 Margin</Typography>
          {[MatchState.draw, MatchState.team1Win].includes(
            matchState || MatchState.team2Win,
          ) &&
            [...Array(sizeOfTeams)].map((_, index) => (
              <Button
                key={index}
                variant={team1Margin === index + 1 ? 'contained' : 'text'}
                color={team1Margin === index + 1 ? 'warning' : 'primary'}
                onClick={() => setTeam1Margin(index + 1)}
              >
                + {index + 1}
              </Button>
            ))}
          {[MatchState.draw, MatchState.team2Win].includes(
            matchState || MatchState.team1Win,
          ) &&
            [...Array(sizeOfTeams)].map((_, index) => (
              <Button
                key={index}
                variant={team1Margin === index + 1 ? 'contained' : 'text'}
                color={team1Margin === index + 1 ? 'warning' : 'primary'}
                onClick={() => setTeam1Margin(index + 1)}
              >
                - {index + 1}
              </Button>
            ))}
        </FlexContainer>
        <Typography variant="h4Bold">VS</Typography>
        <FlexContainer flexDirection="column">
          <Typography variant="p1Medium">Team 2 Margin</Typography>

          {[...Array(sizeOfTeams)].map((_, index) => (
            <Button
              key={index}
              variant={team2Margin === index + 1 ? 'contained' : 'text'}
              color={team2Margin === index + 1 ? 'warning' : 'primary'}
              onClick={() => setTeam2Margin(index + 1)}
            >
              - {index + 1}
            </Button>
          ))}
        </FlexContainer>
      </FlexContainer>
      <Button variant="contained" style={{ width: '150px' }}>
        Confirm Match
      </Button>
    </FlexContainer>
  );
};

export default FinishMatch;
