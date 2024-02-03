import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import CustomTextField from 'components/shared/CustomTextField';
import FlexContainer from 'components/shared/FlexContainer';
import { useFormik } from 'formik';
import { useState } from 'react';
import Game from 'types/Game';
import { Match } from 'types/Match';
import MatchState from 'types/MatchState';
import { millisecondsToTime } from 'utils/dateUtils';
import { LeagueDetailsSchema } from 'utils/schemes';

interface IProps {
  game: Game;
  onConfirm: (game: Game, isEdit: boolean) => void;
  onClose: () => void;
}

const AddOrEditGame = ({ game, onClose, onConfirm }: IProps) => {
  const [selectedMatch, setSelectedMatch] = useState<Match>();
  const formik = useFormik<Game>({
    initialValues: {
      ...game,
    },
    validationSchema: LeagueDetailsSchema,
    onSubmit: (values: Game) => {
      console.log(values);
      onConfirm(values, true);
    },
  });

  const onMatchSelected = (match: Match) => {
    setSelectedMatch(match);
  };

  const matchFormik = useFormik<Match>({
    initialValues: { ...game?.matches[0] },
    onSubmit: (editedMatch: Match) => {
      console.log(editedMatch);
    },
  });

  const formattedGameTime = millisecondsToTime(game.gameTime);
  console.log(game.gameTime);
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
            color={(theme) => theme.palette.text.disabled}
          >
            .{formattedGameTime.milisecondsString}
          </Typography>
        </Typography>
        <FlexContainer width="100%" flexDirection="row" gap={8}>
          <Typography variant="p1">
            <Typography variant="p1Medium">{game.team1.teamName}</Typography>{' '}
            {game.team1Wins}
          </Typography>
          <Typography>VS</Typography>
          <Typography variant="p1">
            <Typography variant="p1Medium">{game.team2.teamName}</Typography>{' '}
            {game.team2Wins}
          </Typography>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer flexDirection="row" gap={8}>
        <FlexContainer
          width="100%"
          flexDirection="column"
          highlightRowOnHover
          alignItems="flex-start"
        >
          <Typography>Matches</Typography>
          {game?.matches?.map((match, index) => {
            const formattedMatchTime = millisecondsToTime(
              match.matchDurationInSeconds,
            );

            return (
              <FlexContainer
                flexDirection="column"
                padding="8px"
                key={index}
                width="100%"
              >
                <FlexContainer
                  flexDirection="row"
                  gap={8}
                  width="100%"
                  alignItems="flex-start"
                >
                  <Typography
                    color={(theme) =>
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
                    color={(theme) =>
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
                    color={(theme) =>
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
                    color={(theme) =>
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
                  {/* <IconButton onClick={() => onMatchSelected(match)}>
                    <FontAwesomeIcon icon={faEdit} width={15} />
                  </IconButton> */}
                </FlexContainer>
                <Typography
                  color={(theme) => theme.palette.text.disabled}
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
                      color={(theme) => theme.palette.text.disabled}
                    >
                      .{formattedMatchTime.milisecondsString}
                    </Typography>
                  </Typography>
                </Typography>
              </FlexContainer>
            );
          })}
        </FlexContainer>
        <FlexContainer flexDirection="column" gap={8}>
          Selected Match{' '}
          {selectedMatch
            ? game.matches.findIndex((match) => match.id === selectedMatch?.id)
            : ''}
          <FormControl fullWidth>
            <InputLabel>Match state</InputLabel>
            <Select
              style={{ width: '250px' }}
              value={matchFormik.values.matchState}
              label="Match state"
              onChange={(e) => {
                console.log(e.target.value);
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
          <CustomTextField label="Team 1 margin" />
          <CustomTextField label="Team 2 margin" />
        </FlexContainer>
      </FlexContainer>

      <FlexContainer flexDirection="row" gap={16}>
        <Button
          variant="contained"
          onClick={formik.submitForm}
          disabled={!formik.isValid || !formik.dirty}
        >
          <Typography variant="p1">Confirm</Typography>
        </Button>
        <Button variant="outlined" onClick={onClose}>
          <Typography variant="p1">Cancel</Typography>
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
};

export default AddOrEditGame;
