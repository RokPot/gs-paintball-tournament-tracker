import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CustomCheckbox from 'components/shared/CustomCheckbox';
import CustomTextField from 'components/shared/CustomTextField';
import FlexContainer from 'components/shared/FlexContainer';
import TeamMultiSelect from 'components/shared/multiselect/TeamMultiSelect';
import TeamsShortList from 'components/teams/TeamShortList';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/sl';
import { useFormik } from 'formik';
import useTournamentPresets, {
  IAddTournament,
} from 'hooks/tournament/useTournamentPresets';
import { useState } from 'react';
import { DefaultGameSettings } from 'types/GameSettings';
import League from 'types/League';
import Tournament from 'types/Tournament';
import {
  DefaultTournamentSettings,
  TournamentSettings,
} from 'types/TournamentSettings';
import TournamentState from 'types/TournamentState';
import { TournamentStatus } from 'types/TournamentStatus';
import { TournamentTypeEnum, TournamentTypeLabels } from 'types/TournamentType';
import { convertFromSecondsDayjs, fromDayjsToSeconds } from 'utils/dateUtils';
import { v4 } from 'uuid';

interface IProps {
  onAccept: (tournament: Tournament) => Promise<void>;
  onCancel: () => void;
  league: League | undefined | null;
}

interface AddGameSettings {
  longBreakTimeInSeconds: Dayjs;
  shortBreakTimeInSeconds: Dayjs;
  gameTimeInSeconds: Dayjs;
}

const QuickAddTournament = ({ onAccept, onCancel, league }: IProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const presets = useTournamentPresets();

  const formik = useFormik<IAddTournament>({
    initialValues: {
      name: '',
      teams: [],
      startDate: dayjs(),
      endDate: dayjs().add(1, 'day'),
      gameSettings: {
        longBreakTimeInSeconds: convertFromSecondsDayjs(
          DefaultGameSettings.longBreakTimeInSeconds,
        ),
        shortBreakTimeInSeconds: convertFromSecondsDayjs(
          DefaultGameSettings.shortBreakTimeInSeconds,
        ),
        gameTimeInSeconds: convertFromSecondsDayjs(
          DefaultGameSettings.gameTimeInSeconds,
        ),
        manualGameStartTimeInSeconds: convertFromSecondsDayjs(
          DefaultGameSettings.manualGameStartTimeInSeconds,
        ),
        betweenGamePauseTimeInSeconds: convertFromSecondsDayjs(
          DefaultGameSettings.betweenGamePauseTimeInSeconds,
        ),
      },
      settings: DefaultTournamentSettings,
    },
    onSubmit: async (values: IAddTournament) => {
      try {
        setIsProcessing(true);
        const tournamentId = v4();

        await onAccept(
          new Tournament({
            id: tournamentId,
            _id: tournamentId,
            name: values.name,
            gameSettings: {
              id: v4(),
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

            stages: [],

            state: new TournamentState({
              id: v4(),
              isGameInProgress: false,
              isTournamentFinished: false,
              status: TournamentStatus.created,
              stage: 1,
              pairedGame1Id: '',
              pairedGame2Id: '',
              activeGameId: '',
            }),
            teams: values.teams,
            leaderboard: [],
          }),
        );
      } catch (e) {
        console.error(e);
      } finally {
        setIsProcessing(false);
      }
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
        <Typography variant="h1">Quick Add Tournament</Typography>
      </FlexContainer>

      <FlexContainer
        maxHeight="500px"
        flexDirection="column"
        alignItems="flex-start"
        gap={16}
        width="100%"
        overflowY="scroll"
        style={{ flexGrow: '1', paddingRight: '8px' }}
      >
        <FlexContainer flexDirection="row" gap={8}>
          {presets?.map((preset, index) => (
            <Button
              key={index}
              variant="text"
              onClick={() => {
                formik.setValues({
                  ...preset.preset,
                  name: `${preset.name} - ${dayjs().format(
                    'DD.MM.YYYY - HH:mm',
                  )}`,
                });
              }}
            >
              <Typography variant="p1">{preset.name}</Typography>
            </Button>
          ))}

          <Button variant="text">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </FlexContainer>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sl">
          <Typography variant="h3" marginBottom="0px !important">
            Teams
          </Typography>
          <Typography
            variant="subtitle2"
            color={(theme) => theme.palette.text.disabled}
          >
            Add teams from league that will participate in this tournament
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
          <FlexContainer flexDirection="row" width="100%" gap={8}>
            {formik.values.settings.firstStageType.type !==
              TournamentTypeEnum.renting && (
              <CustomTextField
                inputProps={{ pattern: '[0-9]*' }}
                type="number"
                label="Number of wins required *"
                id="numberOfWinsRequired"
                value={
                  formik.values.settings?.firstStageType.settings
                    ?.numberOfWinsRequired
                }
                onChange={(e) =>
                  formik.setFieldValue('settings', {
                    ...formik.values.settings,
                    numberOfWinsRequired: Number(e.target.value),
                  } as TournamentSettings)
                }
                placeholder="2"
                variant="outlined"
                style={{ width: '100%' }}
                helperText={String(formik?.errors?.name || ' ')}
                debounceTime={200}
                disableError
              />
            )}
            {formik.values.settings.firstStageType.type !==
              TournamentTypeEnum.renting && (
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
            )}
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formik?.values?.settings.firstStageType}
                label="Type"
                onChange={(e) =>
                  formik.setFieldValue('settings', {
                    ...formik.values.settings,
                    firstStageType: e.target.value,
                  } as TournamentSettings)
                }
              >
                {Object.values(TournamentTypeEnum)?.map(
                  (tournamentKey, index) => (
                    <MenuItem key={index} value={tournamentKey}>
                      {TournamentTypeLabels[tournamentKey]}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
          </FlexContainer>

          {formik?.values?.settings.numberOfGroups > 1 && (
            <FormControl fullWidth>
              <InputLabel>Second stage type</InputLabel>
              <Select
                value={formik?.values?.settings.secondStageType}
                label="Second stage type"
                onChange={(e) =>
                  formik.setFieldValue('settings', {
                    ...formik.values.settings,
                    secondStageType: e.target.value,
                  } as TournamentSettings)
                }
              >
                {Object.values(TournamentTypeEnum)?.map(
                  (tournamentKey, index) => (
                    <MenuItem key={index} value={tournamentKey}>
                      {TournamentTypeLabels[tournamentKey]}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
          )}
          {formik.values.settings.firstStageType.type !==
            TournamentTypeEnum.renting && (
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
          )}
          {formik?.values?.settings.firstStageType.type ===
            TournamentTypeEnum.roundRobin && (
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
          )}
          {formik.values.settings.firstStageType.type !==
            TournamentTypeEnum.renting && (
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
          )}
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
          {formik.values.settings.firstStageType.type !==
            TournamentTypeEnum.renting && (
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
          )}
          {formik.values.settings.firstStageType.type !==
            TournamentTypeEnum.renting && (
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
          )}
          {formik.values.settings.firstStageType.type !==
            TournamentTypeEnum.renting && (
            <>
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
                  value={
                    formik?.values?.gameSettings?.manualGameStartTimeInSeconds
                  }
                  onChange={(newTime) =>
                    formik.setFieldValue('gameSettings', {
                      ...formik.values.gameSettings,
                      manualGameStartTimeInSeconds: newTime,
                    } as AddGameSettings)
                  }
                />
              </FlexContainer>
            </>
          )}
        </LocalizationProvider>
      </FlexContainer>
      <FlexContainer flexDirection="row" gap={16} padding="16px">
        <LoadingButton
          variant="contained"
          onClick={formik.submitForm}
          disabled={!formik.isValid}
          loading={isProcessing}
        >
          <Typography variant="p1">Confirm</Typography>
        </LoadingButton>
        <Button variant="outlined" onClick={onCancel}>
          <Typography variant="p1">Cancel</Typography>
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
};

export default QuickAddTournament;
