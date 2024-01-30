import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CustomCheckbox from 'components/shared/CustomCheckbox';
import CustomTextField from 'components/shared/CustomTextField';
import FlexContainer from 'components/shared/FlexContainer';
import TeamMultiSelect from 'components/shared/multiselect/TeamMultiSelect';
import TeamsShortList from 'components/teams/TeamShortList';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/sl';
import { useFormik } from 'formik';
import { DefaultGameSettings } from 'types/GameSettings';
import League from 'types/League';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import {
  DefaultTournamentSettings,
  TournamentSettings,
} from 'types/TournamentSettings';
import TournamentState from 'types/TournamentState';
import { TournamentStatus } from 'types/TournamentStatus';
import { TournamentType, TournamentTypeLabels } from 'types/TournamentType';
import { v4 } from 'uuid';

interface IProps {
  onAccept: (tournament: Tournament, isEdit: boolean) => void;
  onCancel: () => void;
  league?: League;
  tournament?: Tournament;
}

interface AddGameSettings {
  longBreakTimeInSeconds: Dayjs;
  shortBreakTimeInSeconds: Dayjs;
  gameTimeInSeconds: Dayjs;
}

interface AddTournament {
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
  gameSettings: {
    longBreakTimeInSeconds: Dayjs;
    shortBreakTimeInSeconds: Dayjs;
    gameTimeInSeconds: Dayjs;
    manualGameStartTimeInSeconds: Dayjs;
    betweenGamePauseTimeInSeconds: Dayjs;
  };
  settings: TournamentSettings;
  teams: Team[];
}

const convertFromSecondsDayjs = (seconds: number) => {
  return dayjs()
    .minute(Math.floor(seconds / 60))
    .second(seconds % 60);
};

const fromDayjsToSeconds = (time: Dayjs) => {
  return (time.minute() || 1) * (time.second() || 60);
};

const AddOrEditTournament = ({
  onAccept,
  onCancel,
  league,
  tournament,
}: IProps) => {
  const formik = useFormik<AddTournament>({
    initialValues: {
      name: tournament?.name || '',
      teams: tournament?.teams || [],
      startDate: tournament?.startDate || dayjs(),
      endDate: tournament?.endDate || dayjs().add(1, 'day'),
      gameSettings: {
        longBreakTimeInSeconds: convertFromSecondsDayjs(
          tournament?.gameSettings?.longBreakTimeInSeconds ||
            DefaultGameSettings.longBreakTimeInSeconds,
        ),
        shortBreakTimeInSeconds: convertFromSecondsDayjs(
          tournament?.gameSettings?.shortBreakTimeInSeconds ||
            DefaultGameSettings.shortBreakTimeInSeconds,
        ),
        gameTimeInSeconds: convertFromSecondsDayjs(
          tournament?.gameSettings?.gameTimeInSeconds ||
            DefaultGameSettings.gameTimeInSeconds,
        ),
        manualGameStartTimeInSeconds: convertFromSecondsDayjs(
          tournament?.gameSettings?.manualGameStartTimeInSeconds ||
            DefaultGameSettings.manualGameStartTimeInSeconds,
        ),
        betweenGamePauseTimeInSeconds: convertFromSecondsDayjs(
          tournament?.gameSettings?.betweenGamePauseTimeInSeconds ||
            DefaultGameSettings.betweenGamePauseTimeInSeconds,
        ),
      },
      settings: tournament?.settings || DefaultTournamentSettings,
    },
    onSubmit: (values: AddTournament) => {
      const tournamentId = tournament?._id || v4();

      onAccept(
        new Tournament({
          id: tournamentId,
          _id: tournamentId,
          name: values.name,
          gameSettings: {
            id: tournament?.gameSettings?.id || v4(),
            longBreakTimeInSeconds: fromDayjsToSeconds(
              values.gameSettings.longBreakTimeInSeconds,
            ),
            shortBreakTimeInSeconds: fromDayjsToSeconds(
              values.gameSettings.shortBreakTimeInSeconds,
            ),
            gameTimeInSeconds: fromDayjsToSeconds(
              values.gameSettings.gameTimeInSeconds,
            ),
            betweenGamePauseTimeInSeconds: fromDayjsToSeconds(
              values.gameSettings.betweenGamePauseTimeInSeconds,
            ),
            manualGameStartTimeInSeconds: fromDayjsToSeconds(
              values.gameSettings.manualGameStartTimeInSeconds,
            ),
          },
          settings: values.settings,
          endDate: values.endDate.toISOString(),
          startDate: values.startDate.toISOString(),

          groups: tournament?.groups || [],

          state: new TournamentState({
            id: tournament?.state?.id || v4(),
            isGameInProgress: tournament?.state?.isGameInProgress || false,
            isTournamentFinished:
              tournament?.state?.isTournamentFinished || false,
            status: tournament?.state?.status || TournamentStatus.created,
            stage: tournament?.state?.stage || 0,
          }),
          teams: values.teams,
          leaderboard: tournament?.leaderboard || [],
        }),
        !!tournament,
      );
    },
  });

  return (
    <FlexContainer
      padding="16px"
      width="100%"
      flexDirection="column"
      alignItems="flex-start"
      flex="auto"
    >
      <FlexContainer>
        <Typography variant="h1">
          {tournament ? 'Edit' : 'Create'} tournament
        </Typography>
      </FlexContainer>

      <FlexContainer
        maxHeight="500px"
        flexDirection="column"
        alignItems="flex-start"
        gap={16}
        width="100%"
        overflowY="scroll"
        style={{ flexGrow: '1' }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sl">
          <Typography variant="h3">Details</Typography>
          <FlexContainer width="100%" gap={16} style={{ marginBottom: '0px' }}>
            <CustomTextField
              label="Tournament name *"
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="Tournament name"
              variant="outlined"
              style={{ width: '100%' }}
              helperText={String(formik?.errors?.name || ' ')}
              debounceTime={200}
            />
          </FlexContainer>
          <FlexContainer width="100%" justifyContent="space-between" gap={8}>
            <DesktopDatePicker
              onChange={(date) => formik.setFieldValue('startDate', date)}
              defaultValue={formik.values.startDate}
              label="Tournament start date"
              sx={{ width: '100%' }}
            />
            <DesktopDatePicker
              onChange={(date) => formik.setFieldValue('endDate', date)}
              defaultValue={formik.values.endDate}
              sx={{ width: '100%' }}
              label="Tournament end date"
            />
          </FlexContainer>
          <Typography variant="h3" marginBottom="0px !important">
            Teams
          </Typography>
          <Typography
            variant="subtitle2"
            color={(theme) => theme.palette.text.disabled}
          >
            Add teams from league that will participate in this tournament asd
          </Typography>
          <TeamMultiSelect
            selectedTeams={formik?.values?.teams}
            onTeamsChanged={(teams) => formik.setFieldValue('teams', teams)}
            options={league?.teams}
          />

          <TeamsShortList
            teams={formik?.values?.teams}
            showRemoveButton
            onRemoveTeam={(team) => {
              const selectedTeams = formik.values.teams;
              selectedTeams?.splice(
                selectedTeams.findIndex(
                  (selectedTeam) => selectedTeam.id === team.id,
                ),
                1,
              );
              formik.setFieldValue('teams', selectedTeams);
            }}
          />

          <Typography variant="h3">Tournament settings</Typography>
          <CustomTextField
            inputProps={{ pattern: '[0-9]*' }}
            type="number"
            label="Number of wins required *"
            id="name"
            value={formik.values.settings?.numberOfWinsRequired}
            onChange={formik.handleChange}
            placeholder="2"
            variant="outlined"
            style={{ width: '100%' }}
            helperText={String(formik?.errors?.name || ' ')}
            debounceTime={200}
            disableError
          />
          <FormControl fullWidth>
            <InputLabel>Team size</InputLabel>
            <Select
              value={formik?.values?.settings.numberOfTeamSize}
              label="Team size"
              onChange={(e) =>
                formik.setFieldValue('settings', {
                  ...formik.values.settings,
                  numberOfTeamSize: Number(e.target.value),
                } as TournamentSettings)
              }
            >
              {[1, 2, 3, 4, 5, 6]?.map((teamSize, index) => (
                <MenuItem key={index} value={teamSize}>
                  {teamSize}-man
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={formik?.values?.settings.type}
              label="Type"
              onChange={(e) =>
                formik.setFieldValue('settings', {
                  ...formik.values.settings,
                  type: e.target.value,
                } as TournamentSettings)
              }
            >
              {Object.values(TournamentType)?.map((tournamentKey, index) => (
                <MenuItem key={index} value={tournamentKey}>
                  {TournamentTypeLabels[tournamentKey]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formik?.values?.settings.type === TournamentType.roundRobin && (
            <FormControl fullWidth>
              <InputLabel>Second stage type</InputLabel>
              <Select
                value={formik?.values?.settings.secondStageType}
                label="Second stage type"
                onChange={(e) =>
                  formik.setFieldValue('settings', {
                    ...formik.values.settings,
                    type: e.target.value,
                  } as TournamentSettings)
                }
              >
                {Object.values(TournamentType)?.map((tournamentKey, index) => (
                  <MenuItem key={index} value={tournamentKey}>
                    {TournamentTypeLabels[tournamentKey]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <CustomCheckbox
            onChange={(checked) =>
              formik.setFieldValue('settings', {
                ...formik.values.settings,
                twoWinsDifference: checked,
              } as TournamentSettings)
            }
            checked={formik.values.settings?.twoWinsDifference}
            label="Win Condition: 2 point difference"
            tooltip="If this is checked, then a pair of games will play at the same time and matches will be switched every round."
          />
          <CustomCheckbox
            onChange={(checked) =>
              formik.setFieldValue('settings', {
                ...formik.values.settings,
                switchGames: checked,
              } as TournamentSettings)
            }
            checked={formik.values.settings?.switchGames}
            label="Switch paired games"
            tooltip="If this is checked, then a pair of games will play at the same time and matches will be switched every round."
          />
          <CustomTextField
            inputProps={{ pattern: '[0-9]*' }}
            type="number"
            label="Number of groups *"
            id="name"
            value={formik.values.settings?.numberOfGroups}
            onChange={(value) =>
              formik.setFieldValue('settings', {
                ...formik.values.settings,
                numberOfGroups: Number(value.target.value),
              } as TournamentSettings)
            }
            placeholder="2"
            variant="outlined"
            style={{ width: '100%', marginTop: '8px' }}
            helperText={String(formik?.errors?.name || ' ')}
            debounceTime={0}
            disableError
          />
          {formik?.values?.settings?.numberOfGroups > 1 && (
            <CustomCheckbox
              onChange={(checked) =>
                formik.setFieldValue('settings', {
                  ...formik.values.settings,
                  switchGroups: checked,
                } as TournamentSettings)
              }
              checked={formik.values.settings?.switchGroups}
              label="Switch groups"
              tooltip="If this is checked, then group will rotate after every finished game."
            />
          )}
          <CustomCheckbox
            onChange={(checked) =>
              formik.setFieldValue('settings', {
                ...formik.values.settings,
                shouldInsertMatchMargins: checked,
              } as TournamentSettings)
            }
            checked={formik.values.settings?.shouldInsertMatchMargins}
            label="Include match margins"
            tooltip="If this is checked, then each match will need match margins (+1/-1) inserted."
          />
          <CustomCheckbox
            onChange={(checked) =>
              formik.setFieldValue('settings', {
                ...formik.values.settings,
                pauseBetweenEachMatch: checked,
              } as TournamentSettings)
            }
            checked={formik.values.settings?.pauseBetweenEachMatch}
            label="Pause between matches"
            tooltip="If this is checked, then timer will be stopped after each match and manual start will be required."
          />
          <Typography variant="h3">Game settings</Typography>

          <TimePicker
            sx={{ width: '100%' }}
            label="Game time"
            views={['minutes', 'seconds']}
            format="mm:ss"
            value={formik?.values?.gameSettings?.gameTimeInSeconds}
            onChange={(newTime) =>
              formik.setFieldValue('gameSettings', {
                ...formik.values.gameSettings,
                gameTimeInSeconds: newTime,
              } as AddGameSettings)
            }
          />
          <FlexContainer width="100%" gap={8}>
            <TimePicker
              sx={{ width: '100%' }}
              label="Short break time"
              views={['minutes', 'seconds']}
              format="mm:ss"
              value={formik?.values?.gameSettings?.shortBreakTimeInSeconds}
              onChange={(newTime) =>
                formik.setFieldValue('gameSettings', {
                  ...formik.values.gameSettings,
                  shortBreakTimeInSeconds: newTime,
                } as AddGameSettings)
              }
            />
            <TimePicker
              sx={{ width: '100%' }}
              label="Long break time"
              views={['minutes', 'seconds']}
              format="mm:ss"
              value={formik?.values?.gameSettings?.longBreakTimeInSeconds}
              onChange={(newTime) =>
                formik.setFieldValue('gameSettings', {
                  ...formik.values.gameSettings,
                  longBreakTimeInSeconds: newTime,
                } as AddGameSettings)
              }
            />
          </FlexContainer>
          <FlexContainer width="100%" gap={8}>
            <TimePicker
              sx={{ width: '100%' }}
              label="Countdown time between games"
              views={['minutes', 'seconds']}
              format="mm:ss"
              value={
                formik?.values?.gameSettings?.betweenGamePauseTimeInSeconds
              }
              onChange={(newTime) =>
                formik.setFieldValue('gameSettings', {
                  ...formik.values.gameSettings,
                  betweenGamePauseTimeInSeconds: newTime,
                } as AddGameSettings)
              }
            />
            <TimePicker
              sx={{ width: '100%' }}
              label="Countdown time for manual game start"
              views={['minutes', 'seconds']}
              format="mm:ss"
              value={formik?.values?.gameSettings?.manualGameStartTimeInSeconds}
              onChange={(newTime) =>
                formik.setFieldValue('gameSettings', {
                  ...formik.values.gameSettings,
                  manualGameStartTimeInSeconds: newTime,
                } as AddGameSettings)
              }
            />
          </FlexContainer>
        </LocalizationProvider>
      </FlexContainer>
      <FlexContainer flexDirection="row" gap={16} padding="16px">
        <Button
          variant="contained"
          onClick={formik.submitForm}
          disabled={!formik.isValid}
        >
          <Typography variant="p1">Confirm</Typography>
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          <Typography variant="p1">Cancel</Typography>
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
};

export default AddOrEditTournament;
