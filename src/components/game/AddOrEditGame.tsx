import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Theme,
  Typography,
  alpha,
  css,
  styled,
  useTheme,
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FlexContainer from 'components/shared/FlexContainer';
import { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import Game from 'types/Game';
import { GameState, GameStateLabels, GameWinner } from 'types/GameState';
import { Match } from 'types/Match';
import MatchState from 'types/MatchState';
import {
  convertFromSecondsDayjs,
  fromDayjsToSeconds,
  millisecondsToTime,
} from 'utils/dateUtils';
import { LeagueDetailsSchema } from 'utils/schemes';
import { v4 } from 'uuid';

interface IStyledGameStatusCircleProps {
  color?: string;
}

const StyledGameStatusCircle = styled('div')(
  (props: IStyledGameStatusCircleProps & { theme?: Theme }) => css`
    border-radius: 10px;
    height: 13px;
    width: 13px;

    background-color: ${props.color};
    margin: 4px;
  `,
);

interface IProps {
  game: Game;
  sizeOfTeams: number;
  onConfirm: (game: Game) => Promise<void>;
  onClose: () => void;
}

interface EditMatch {
  team1Margin: number;
  team2Margin: number;
  matchState: MatchState;
  matchDurationInSeconds: Dayjs;
}

interface EditGame {
  team1Wins: number;
  team2Wins: number;
  gameState: GameState;
  gameTime: Dayjs;
}

const AddOrEditGame = ({
  game: entryGame,
  onClose,
  onConfirm,
  sizeOfTeams,
}: IProps) => {
  const [game] = useState(new Game(entryGame));
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match>();
  const [matches, setMatches] = useState<Match[]>(game?.matches || []);
  const [availableTeam1Margins, setAvailableTeam1Margins] =
    useState<number[]>();
  const [availableTeam2Margins, setAvailableTeam2Margins] =
    useState<number[]>();

  const theme = useTheme();

  const gameFormik = useFormik<EditGame>({
    initialValues: {
      ...game,
      gameTime: convertFromSecondsDayjs(game.gameTime),
    },
    validationSchema: LeagueDetailsSchema,
    onSubmit: () => {},
  });

  const matchFormik = useFormik<EditMatch>({
    initialValues: {
      ...game?.matches[0],
      matchDurationInSeconds: convertFromSecondsDayjs(
        (game?.matches?.[0]?.matchDurationInSeconds || 0) / 1000,
      ),
    },
    onSubmit: () => {},
  });

  const onMatchSelected = (match: Match) => {
    setSelectedMatch(match);
    matchFormik.setValues({
      ...match,
      matchDurationInSeconds: convertFromSecondsDayjs(
        match.matchDurationInSeconds / 1000,
      ),
    });
  };

  const onGameConfirm = useCallback(async () => {
    try {
      setIsProcessing(true);
      game.gameState = gameFormik.values.gameState;
      game.team1Wins = gameFormik.values.team1Wins;
      game.team2Wins = gameFormik.values.team2Wins;
      game.gameTime = fromDayjsToSeconds(gameFormik.values.gameTime);
      game.matches = matches;
      await onConfirm(game);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  }, [game, gameFormik, onConfirm, matches]);

  const updateMatch = useCallback(() => {
    if (!game || !selectedMatch) {
      return;
    }
    const gameMatch = matches.find((match) => match.id === selectedMatch.id);
    if (!gameMatch) {
      return;
    }

    switch (gameMatch.matchState) {
      case MatchState.draw: {
        break;
      }
      case MatchState.team1Win: {
        // If previously team 1 won, we need to revert team score
        game.team1Wins -= 1;
        break;
      }
      case MatchState.team2Win: {
        // If previously team 2 won, we need to revert team score
        game.team2Wins -= 1;
        break;
      }
      default: {
        break;
      }
    }

    switch (matchFormik.values.matchState) {
      case MatchState.draw: {
        break;
      }
      case MatchState.team1Win: {
        // If previously team 1 won, we need to revert team score
        game.team1Wins += 1;
        break;
      }
      case MatchState.team2Win: {
        // If previously team 2 won, we need to revert team score
        game.team2Wins += 1;
        break;
      }
      default: {
        break;
      }
    }
    if (game.team1Wins === game.team2Wins) {
      game.gameWinner = GameWinner.draw;
    } else if (game.team1Wins > game.team2Wins) {
      game.gameWinner = GameWinner.team1;
    } else {
      game.gameWinner = GameWinner.team2;
    }
    gameMatch.matchState = matchFormik.values.matchState;
    gameMatch.team1Margin = matchFormik.values.team1Margin;
    gameMatch.team2Margin = matchFormik.values.team2Margin;
    const previousMatchDuration = convertFromSecondsDayjs(
      gameMatch.matchDurationInSeconds / 1000,
    );
    gameMatch.matchDurationInSeconds =
      fromDayjsToSeconds(matchFormik.values.matchDurationInSeconds) * 1000;
    const { gameTime } = gameFormik.values;
    const gameTimeInNumber =
      fromDayjsToSeconds(gameTime) +
      fromDayjsToSeconds(previousMatchDuration) -
      fromDayjsToSeconds(matchFormik.values.matchDurationInSeconds);

    gameFormik.setFieldValue(
      'gameTime',
      convertFromSecondsDayjs(gameTimeInNumber),
    );
    setMatches([...matches]);
  }, [
    game,
    gameFormik,
    matchFormik.values.matchDurationInSeconds,
    matchFormik.values.matchState,
    matchFormik.values.team1Margin,
    matchFormik.values.team2Margin,
    matches,
    selectedMatch,
  ]);

  const addNewMatch = useCallback(() => {
    const newMatch: Match = {
      id: v4(),
      matchState: MatchState.draw,
      team1Margin: 0,
      team2Margin: 0,
      matchDurationInSeconds: 0,
    };
    setMatches([newMatch, ...matches]);
    setSelectedMatch(newMatch);
  }, [matches]);

  const removeMatch = useCallback(
    (id: string) => {
      const matchIndex = matches.findIndex((match) => match.id === id);
      if (matchIndex === -1) {
        return;
      }
      const match = matches[matchIndex];
      switch (match.matchState) {
        case MatchState.draw: {
          break;
        }
        case MatchState.team1Win: {
          game.team1Wins -= 1;
          break;
        }
        case MatchState.team2Win: {
          game.team2Wins -= 1;
          break;
        }
        default: {
          break;
        }
      }
      if (game.team1Wins === game.team2Wins) {
        game.gameWinner = GameWinner.draw;
      } else if (game.team1Wins > game.team2Wins) {
        game.gameWinner = GameWinner.team1;
      } else {
        game.gameWinner = GameWinner.team2;
      }
      matches.splice(matchIndex, 1);
      setMatches([...matches]);
      gameFormik.setFieldValue(
        'gameTime',
        convertFromSecondsDayjs(
          fromDayjsToSeconds(gameFormik.values.gameTime) +
            match.matchDurationInSeconds / 1000,
        ),
      );
    },
    [game, gameFormik, matches],
  );

  useEffect(() => {
    if (matchFormik?.values?.matchState === MatchState.team1Win) {
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
    if (matchFormik?.values?.matchState === MatchState.team2Win) {
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
    if (matchFormik?.values?.matchState === MatchState.draw) {
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
  }, [matchFormik?.values?.matchState, sizeOfTeams]);

  const formattedGameTime = millisecondsToTime(
    fromDayjsToSeconds(gameFormik.values.gameTime) * 1000,
  );
  const getGameStatusColor = (gameState: GameState) => {
    switch (gameState) {
      case GameState.finished:
        return theme.palette.error.main;
      case GameState.playing:
        return theme.palette.success.main;
      case GameState.waiting:
        return theme.palette.warning.main;
      default:
        return 'blue';
    }
  };
  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      alignItems="flex-start"
      gap={16}
    >
      <Typography variant="h1">{`${game ? 'Edit' : 'Add'} game`}</Typography>

      <FlexContainer
        flexDirection="column"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h2" lineHeight="normal">
          {formattedGameTime.formatted}
          <Typography
            variant="h6Medium"
            display="inline-block"
            color={theme.palette.text.disabled}
          >
            .{formattedGameTime.milisecondsString}
          </Typography>
        </Typography>
        <FlexContainer
          width="100%"
          flexDirection="row"
          gap={8}
          justifyContent="center"
        >
          <Typography variant="h5" display="inline-block">
            <Typography variant="h5Medium" display="inline-block">
              {game.team1.teamName}
            </Typography>{' '}
            {game.team1Wins}
          </Typography>
          <Typography>VS</Typography>
          <Typography variant="h5" display="inline-block">
            {game.team2Wins}{' '}
            <Typography variant="h5Medium" display="inline-block">
              {game.team2.teamName}
            </Typography>
          </Typography>
        </FlexContainer>
      </FlexContainer>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sl">
        <TimePicker
          disabled={false}
          sx={{ width: '100%' }}
          label="Game time"
          views={['minutes', 'seconds']}
          format="mm:ss"
          value={gameFormik?.values?.gameTime}
          onChange={(newTime) => {
            gameFormik.setFieldValue('gameTime', newTime);
          }}
          timeSteps={{
            minutes: 1,
            seconds: 1,
          }}
        />
      </LocalizationProvider>
      <FlexContainer
        flexDirection="row"
        gap={8}
        width="100%"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <FlexContainer
          width="100%"
          flexDirection="column"
          highlightRowOnHover
          alignItems="flex-start"
        >
          <FlexContainer flexDirection="row" gap={8}>
            <Typography variant="p1Medium">Matches</Typography>
            <Button size="small" onClick={() => addNewMatch()}>
              <Typography style={{ textTransform: 'none' }}>
                Add new match
              </Typography>
            </Button>
          </FlexContainer>
          {matches?.map((match, index) => {
            const formattedMatchTime = millisecondsToTime(
              match.matchDurationInSeconds,
            );

            return (
              <FlexContainer
                flexDirection="column"
                padding="8px"
                key={index}
                width="100%"
                cursor="pointer"
                onClick={() => onMatchSelected(match)}
                alignItems="center"
                position="relative"
                style={{
                  backgroundColor:
                    selectedMatch?.id === match.id
                      ? alpha(theme.palette.primary.light, 0.2)
                      : '',
                }}
              >
                <FlexContainer
                  flexDirection="row"
                  gap={8}
                  width="100%"
                  alignItems="flex-start"
                >
                  <Typography variant="p1Bold">{index + 1}.</Typography>

                  <Typography
                    color={
                      match.matchState === MatchState.team1Win
                        ? theme.palette.primary.main
                        : theme.palette.text.primary
                    }
                    variant={
                      match.matchState === MatchState.team1Win
                        ? 'p1Medium'
                        : 'p1'
                    }
                  >
                    {game.team1.teamName}
                  </Typography>
                  <Typography
                    variant="p1Bold"
                    color={
                      match.team1Margin > 0
                        ? theme.palette.success.main
                        : theme.palette.error.main
                    }
                  >
                    {match.team1Margin > 0
                      ? `+ ${match.team1Margin}`
                      : match.team1Margin}
                  </Typography>
                  <Typography> vs </Typography>
                  <Typography
                    variant="p1Bold"
                    color={
                      match.team2Margin > 0
                        ? theme.palette.success.main
                        : theme.palette.error.main
                    }
                  >
                    {match.team2Margin > 0
                      ? `+ ${match.team2Margin}`
                      : match.team2Margin}
                  </Typography>

                  <Typography
                    color={
                      match.matchState === MatchState.team2Win
                        ? theme.palette.primary.main
                        : theme.palette.text.primary
                    }
                    variant={
                      match.matchState === MatchState.team2Win
                        ? 'p1Medium'
                        : 'p1'
                    }
                  >
                    {game.team2.teamName}
                  </Typography>
                </FlexContainer>
                <Typography
                  color={theme.palette.text.disabled}
                  variant="p3"
                  width="100%"
                  textAlign="start"
                >
                  Match duration:{' '}
                  <Typography variant="p2Medium">
                    {formattedMatchTime.formatted}
                    <Typography
                      variant="p2Medium"
                      fontSize={10}
                      color={theme.palette.text.disabled}
                    >
                      .{formattedMatchTime.milisecondsString}
                    </Typography>
                  </Typography>
                </Typography>
                <IconButton
                  style={{
                    width: '20px',
                    height: '20px',
                    marginLeft: 'auto',
                    position: 'absolute',
                    top: 23,
                    right: 5,
                  }}
                  onClick={(e) => {
                    removeMatch?.(match.id);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <FontAwesomeIcon icon={faRemove} width={10} />
                </IconButton>
              </FlexContainer>
            );
          })}
        </FlexContainer>
        <FlexContainer
          flexDirection="column"
          gap={8}
          style={{
            borderLeft: `solid 1px ${theme.palette.divider}`,
            paddingLeft: '16px',
          }}
        >
          {selectedMatch && (
            <>
              <Typography variant="p1Medium">
                Match{' '}
                {matches.findIndex((match) => match.id === selectedMatch?.id) +
                  1}
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Match state</InputLabel>
                <Select
                  style={{ width: '250px' }}
                  value={matchFormik.values.matchState}
                  label="Match state"
                  onChange={(e) => {
                    matchFormik.setFieldValue(
                      'matchState',
                      e.target.value as MatchState,
                    );
                  }}
                >
                  <MenuItem value={MatchState.draw}>Draw</MenuItem>
                  <MenuItem value={MatchState.team1Win}>
                    {game.team1.teamName} Win
                  </MenuItem>
                  <MenuItem value={MatchState.team2Win}>
                    {game.team2.teamName} Win
                  </MenuItem>
                </Select>
              </FormControl>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="sl"
              >
                <TimePicker
                  disabled={false}
                  sx={{ width: '100%' }}
                  label="Match duration"
                  views={['minutes', 'seconds']}
                  format="mm:ss"
                  value={matchFormik?.values?.matchDurationInSeconds}
                  onChange={(newTime) => {
                    matchFormik.setFieldValue(
                      'matchDurationInSeconds',
                      newTime,
                    );
                  }}
                  timeSteps={{
                    minutes: 1,
                    seconds: 1,
                  }}
                />
              </LocalizationProvider>

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
                      variant={
                        matchFormik.values.team1Margin === margin
                          ? 'contained'
                          : 'text'
                      }
                      color={
                        matchFormik.values.team1Margin === margin
                          ? 'warning'
                          : 'primary'
                      }
                      onClick={() =>
                        matchFormik.setFieldValue('team1Margin', margin)
                      }
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
                      variant={
                        matchFormik.values.team2Margin === margin
                          ? 'contained'
                          : 'text'
                      }
                      color={
                        matchFormik.values.team2Margin === margin
                          ? 'warning'
                          : 'primary'
                      }
                      onClick={() =>
                        matchFormik.setFieldValue('team2Margin', margin)
                      }
                    >
                      {margin > 0 ? `+${margin}` : margin}
                    </Button>
                  ))}
                </FlexContainer>
              </FlexContainer>
              <Button variant="contained" onClick={updateMatch}>
                <Typography variant="p1">Update Match</Typography>
              </Button>
            </>
          )}
        </FlexContainer>
      </FlexContainer>

      <FlexContainer
        flexDirection="row"
        gap={16}
        width="100%"
        style={{
          borderTop: `solid 1px ${theme.palette.divider}`,
          paddingTop: '16px',
        }}
      >
        <LoadingButton
          variant="contained"
          onClick={onGameConfirm}
          loading={isProcessing}
        >
          <Typography variant="p1">Confirm</Typography>
        </LoadingButton>
        <Button variant="outlined" onClick={onClose}>
          <Typography variant="p1">Cancel</Typography>
        </Button>
        <FlexContainer style={{ marginLeft: 'auto' }}>
          <Typography
            variant="p2"
            color={theme.palette.text.disabled}
            lineHeight={0}
          >
            {GameStateLabels[game.gameState]}
          </Typography>
          <StyledGameStatusCircle color={getGameStatusColor(game.gameState)} />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default AddOrEditGame;
