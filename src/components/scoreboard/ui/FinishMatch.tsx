import { Button, Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { useCallback, useEffect, useState } from 'react';
import Game from 'types/Game';
import { Match } from 'types/Match';
import MatchState from 'types/MatchState';
import { v4 } from 'uuid';

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
  const [availableTeam1Margins, setAvailableTeam1Margins] =
    useState<number[]>();
  const [availableTeam2Margins, setAvailableTeam2Margins] =
    useState<number[]>();

  const onMatchStateChanged = (newMatchState: MatchState) => {
    setMatchState(newMatchState);
    setTeam1Margin(0);
    setTeam2Margin(0);
  };

  const finishMatch = useCallback(() => {
    if (!matchState) {
      return;
    }
    const newMatchFinished: Match = {
      id: v4(),
      matchState,
      team1Margin,
      team2Margin,
      matchDurationInSeconds: 123,
    };
    onMatchFinished(newMatchFinished);
  }, [matchState, onMatchFinished, team1Margin, team2Margin]);

  useEffect(() => {
    if (matchState === MatchState.team1Win) {
      const team1MarginsList = [];
      for (let i = sizeOfTeams || 3; i > 0; i -= 1) {
        team1MarginsList.push(i);
      }
      setAvailableTeam1Margins(team1MarginsList);
      const team2MarginsList = [];
      for (let i = -1 * (sizeOfTeams || 3); i < 0; i += 1) {
        team2MarginsList.push(i);
      }
      setAvailableTeam2Margins(team2MarginsList);
      return;
    }
    if (matchState === MatchState.team2Win) {
      const team2MarginsList = [];
      for (let i = sizeOfTeams || 3; i > 0; i -= 1) {
        team2MarginsList.push(i);
      }
      setAvailableTeam2Margins(team2MarginsList);
      const team1MarginsList = [];
      for (let i = -1 * (sizeOfTeams || 3); i < 0; i += 1) {
        team1MarginsList.push(i);
      }
      setAvailableTeam1Margins(team1MarginsList);
      return;
    }
    if (matchState === MatchState.draw) {
      const team1MarginsList = [];
      for (let i = sizeOfTeams || 3; i > 0; i -= 1) {
        team1MarginsList.push(i);
      }
      for (let i = -1; i >= (sizeOfTeams || 3) * -1; i -= 1) {
        team1MarginsList.push(i);
      }
      setAvailableTeam1Margins(team1MarginsList);
      const team2MarginsList = [];
      for (let i = sizeOfTeams || 3; i > 0; i -= 1) {
        team2MarginsList.push(i);
      }
      for (let i = -1; i >= (sizeOfTeams || 3) * -1; i -= 1) {
        team2MarginsList.push(i);
      }
      setAvailableTeam2Margins(team2MarginsList);
    }
  }, [matchState]);

  const areValuesValid =
    matchState &&
    (!shouldInsertTeamsMargins ||
      (shouldInsertTeamsMargins && team1Margin && team2Margin));

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
      <FlexContainer flexDirection="row" gap={8} width="100%">
        <Button
          variant={
            matchState === MatchState.team1Win ? 'contained' : 'outlined'
          }
          color={matchState === MatchState.team1Win ? 'warning' : 'primary'}
          style={{ width: '100%' }}
          onClick={() => onMatchStateChanged(MatchState.team1Win)}
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
          onClick={() => onMatchStateChanged(MatchState.draw)}
        >
          <Typography variant="p1Medium">Draw</Typography>
        </Button>
        <Button
          variant={
            matchState === MatchState.team2Win ? 'contained' : 'outlined'
          }
          color={matchState === MatchState.team2Win ? 'warning' : 'primary'}
          style={{ width: '100%' }}
          onClick={() => onMatchStateChanged(MatchState.team2Win)}
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
      {shouldInsertTeamsMargins && matchState && (
        <FlexContainer
          flexDirection="row"
          width="100%"
          justifyContent="center"
          gap={8}
        >
          <FlexContainer flexDirection="column">
            <Typography variant="p1Medium">Team 1 Margin</Typography>
            {availableTeam1Margins?.map((margin, index) => (
              <Button
                key={index}
                variant={team1Margin === margin ? 'contained' : 'text'}
                color={team1Margin === margin ? 'warning' : 'primary'}
                onClick={() => setTeam1Margin(margin)}
              >
                {margin > 0 ? `+${margin}` : margin}
              </Button>
            ))}
          </FlexContainer>
          <Typography variant="h4Bold">VS</Typography>
          <FlexContainer flexDirection="column">
            <Typography variant="p1Medium">Team 2 Margin</Typography>
            {availableTeam2Margins?.map((margin, index) => (
              <Button
                key={index}
                variant={team2Margin === margin ? 'contained' : 'text'}
                color={team2Margin === margin ? 'warning' : 'primary'}
                onClick={() => setTeam2Margin(margin)}
              >
                {margin > 0 ? `+${margin}` : margin}
              </Button>
            ))}
          </FlexContainer>
        </FlexContainer>
      )}
      {forceInsert && (
        <Typography
          variant="subtitle1"
          color={(theme) => theme.palette.error.main}
        >
          Game has ran out of time.
        </Typography>
      )}
      <Button
        variant="contained"
        style={{ width: '150px' }}
        disabled={!areValuesValid}
        onClick={finishMatch}
      >
        Finish Match
      </Button>
    </FlexContainer>
  );
};

export default FinishMatch;
