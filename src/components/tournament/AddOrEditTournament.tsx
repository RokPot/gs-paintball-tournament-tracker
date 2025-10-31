import { LoadingButton } from '@mui/lab';
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
import { useState } from 'react';
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
import { TournamentTypeEnum, TournamentTypeLabels } from 'types/TournamentType';
import { convertFromSecondsDayjs, fromDayjsToSeconds } from 'utils/dateUtils';
import { v4 } from 'uuid';

interface IProps {
  onAccept: (tournament: Tournament, isEdit: boolean) => Promise<void>;
  onCancel: () => void;
  league: League | undefined | null;
  tournament?: Tournament;
}

interface AddGameSettings {
  longBreakTimeInSeconds: Dayjs;
  shortBreakTimeInSeconds: Dayjs;
  gameTimeInSeconds: Dayjs;
  manualGameStartTimeInSeconds: Dayjs;
  betweenGamePauseTimeInSeconds: Dayjs;
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

const AddOrEditTournament = ({
  onAccept,
  onCancel,
  league,
  tournament,
}: IProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const canEditInProgressTournament =
    (!!tournament && tournament?.state?.status === TournamentStatus.created) ||
    !tournament;

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
    onSubmit: async (values: AddTournament) => {
      try {
        setIsProcessing(true);
        const tournamentId = tournament?._id || v4();

        await onAccept(
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

            stages: tournament?.stages || [],

            state: new TournamentState({
              id: tournament?.state?.id || v4(),
              isGameInProgress: tournament?.state?.isGameInProgress || false,
              isTournamentFinished:
                tournament?.state?.isTournamentFinished || false,
              status: tournament?.state?.status || TournamentStatus.created,
              stage: tournament?.state?.stage || 1,
              pairedGame1Id: tournament?.state?.pairedGame1Id || '',
              pairedGame2Id: tournament?.state?.pairedGame2Id || '',
              activeGameId: tournament?.state?.activeGameId || '',
            }),
            teams: values.teams,
            leaderboard: tournament?.leaderboard || [],
          }),
          !!tournament,
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
        <Typography variant="h1">
          {tournament ? 'Edit' : 'Create'} tournament
        </Typography>
      </FlexContainer>

      <FlexContainer
        maxHeight="500px"
        flexDirection="column"
        alignItems="flex-start"
        gap={12}
        width="100%"
        overflowY="scroll"
        style={{ flexGrow: '1' }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sl">
          <Typography variant="h3">Details</Typography>
          <CustomTextField
            label="Tournament name *"
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder="Tournament name"
            variant="outlined"
            style={{ width: '100%' }}
            helperText={String(formik?.errors?.name || '')}
            debounceTime={200}
          />
          <FlexContainer width="100%" justifyContent="space-between" gap={8}>
            <DesktopDatePicker
              onChange={(date) => formik.setFieldValue('startDate', date)}
              disabled={!canEditInProgressTournament}
              defaultValue={formik.values.startDate}
              label="Tournament start date"
              sx={{ width: '100%' }}
            />
            <DesktopDatePicker
              onChange={(date) => formik.setFieldValue('endDate', date)}
              disabled={!canEditInProgressTournament}
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
            Add teams from league that will participate in this tournament
          </Typography>
          {canEditInProgressTournament && (
            <TeamMultiSelect
              selectedTeams={formik?.values?.teams}
              onTeamsChanged={(teams) => formik.setFieldValue('teams', teams)}
              options={league?.teams}
            />
          )}

          <TeamsShortList
            teams={formik?.values?.teams}
            showRemoveButton={canEditInProgressTournament}
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

          <FormControl fullWidth>
            <InputLabel>Team size</InputLabel>
            <Select
              disabled={!canEditInProgressTournament}
              value={formik?.values?.settings.numberOfTeamSize}
              label="Team size"
              onChange={(e) =>
                formik.setFieldValue('settings', {
                  ...formik.values.settings,
                  numberOfTeamSize: Number(e.target.value),
                } satisfies TournamentSettings)
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
            <InputLabel>First stage type</InputLabel>
            <Select
              disabled={!canEditInProgressTournament}
              value={formik?.values?.settings.firstStageType.type}
              label="First stage type"
              onChange={(e) =>
                formik.setFieldValue('settings', {
                  ...formik.values.settings,
                  firstStageType: {
                    type: e.target.value as TournamentTypeEnum,
                    settings: {
                      numberOfWinsRequired: 2,
                      firstPlaceNumberOfWinsRequired: 2,
                      thirdPlaceNumberOfWinsRequired: 2,
                    },
                  },
                } satisfies TournamentSettings)
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
          <FlexContainer flexDirection="row" width="100%" gap={4}>
            <CustomTextField
              inputProps={{ pattern: '[0-9]*' }}
              type="number"
              label="Wins required*"
              id="numberOfWinsRequired"
              value={
                formik.values.settings.firstStageType.settings
                  ?.numberOfWinsRequired || 2
              }
              onChange={(e) =>
                formik.setFieldValue('settings', {
                  ...formik.values.settings,
                  firstStageType: {
                    ...formik.values.settings.firstStageType,
                    settings: {
                      ...formik.values.settings.firstStageType.settings,
                      numberOfWinsRequired: Number(e.target.value),
                    },
                  },
                } satisfies TournamentSettings)
              }
              placeholder="2"
              variant="outlined"
              style={{ width: '100%' }}
              helperText={String(formik?.errors?.name || ' ')}
              debounceTime={200}
              disableError
            />
            {formik.values.settings.firstStageType.type ===
              TournamentTypeEnum.singleElimination && (
              <>
                <CustomTextField
                  inputProps={{ pattern: '[0-9]*' }}
                  type="number"
                  label="Wins required - 1st place *"
                  id="firstPlaceNumberOfWinsRequired"
                  value={
                    formik.values.settings?.firstStageType.settings
                      ?.firstPlaceNumberOfWinsRequired
                  }
                  onChange={(e) =>
                    formik.setFieldValue('settings', {
                      ...formik.values.settings,
                      firstStageType: {
                        ...formik.values.settings.firstStageType,
                        settings: {
                          ...formik.values.settings.firstStageType.settings,
                          firstPlaceNumberOfWinsRequired: Number(
                            e.target.value,
                          ),
                        },
                      },
                    } satisfies TournamentSettings)
                  }
                  placeholder="2"
                  variant="outlined"
                  style={{ width: '100%' }}
                  helperText={String(formik?.errors?.name || ' ')}
                  debounceTime={200}
                  disableError
                />
                <CustomTextField
                  inputProps={{ pattern: '[0-9]*' }}
                  type="number"
                  label="Wins required - 3rd place *"
                  id="thirdPlaceNumberOfWinsRequired"
                  value={
                    formik.values.settings?.firstStageType.settings
                      ?.thirdPlaceNumberOfWinsRequired
                  }
                  onChange={(e) =>
                    formik.setFieldValue('settings', {
                      ...formik.values.settings,
                      firstStageType: {
                        ...formik.values.settings.firstStageType,
                        settings: {
                          ...formik.values.settings.firstStageType.settings,
                          thirdPlaceNumberOfWinsRequired: Number(
                            e.target.value,
                          ),
                        },
                      },
                    } satisfies TournamentSettings)
                  }
                  placeholder="2"
                  variant="outlined"
                  style={{ width: '100%' }}
                  helperText={String(formik?.errors?.name || ' ')}
                  debounceTime={200}
                  disableError
                />
              </>
            )}
          </FlexContainer>
          {formik?.values?.settings.numberOfGroups > 1 && (
            <>
              <FormControl fullWidth>
                <InputLabel>Second stage type</InputLabel>
                <Select
                  disabled={!canEditInProgressTournament}
                  value={formik?.values?.settings.secondStageType?.type}
                  label="Second stage type"
                  onChange={(e) =>
                    formik.setFieldValue('settings', {
                      ...formik.values.settings,
                      secondStageType: {
                        ...formik.values.settings.secondStageType,
                        type: e.target.value as TournamentTypeEnum,
                        settings: {
                          numberOfWinsRequired: 2,
                          firstPlaceNumberOfWinsRequired: 2,
                          thirdPlaceNumberOfWinsRequired: 2,
                        },
                      },
                    } satisfies TournamentSettings)
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
              {formik.values.settings?.secondStageType?.settings &&
                formik.values.settings.secondStageType && (
                  <FlexContainer flexDirection="row" width="100%" gap={4}>
                    <CustomTextField
                      inputProps={{ pattern: '[0-9]*' }}
                      type="number"
                      label="Wins required *"
                      id="numberOfWinsRequired"
                      value={
                        formik.values.settings?.secondStageType?.settings
                          ?.numberOfWinsRequired
                      }
                      onChange={(e) =>
                        formik.setFieldValue('settings', {
                          ...formik.values.settings,
                          secondStageType: {
                            type: formik.values.settings.secondStageType
                              ?.type as TournamentTypeEnum,
                            settings: {
                              firstPlaceNumberOfWinsRequired:
                                formik.values.settings.secondStageType?.settings
                                  .firstPlaceNumberOfWinsRequired || 2,
                              thirdPlaceNumberOfWinsRequired:
                                formik.values.settings.secondStageType?.settings
                                  .thirdPlaceNumberOfWinsRequired || 2,
                              numberOfWinsRequired: Number(e.target.value),
                            },
                          },
                        } satisfies TournamentSettings)
                      }
                      placeholder="2"
                      variant="outlined"
                      style={{ width: '100%' }}
                      helperText={String(formik?.errors?.name || ' ')}
                      debounceTime={200}
                      disableError
                    />
                    {formik.values.settings?.secondStageType?.settings &&
                      formik.values.settings.secondStageType.type ===
                        TournamentTypeEnum.singleElimination && (
                        <>
                          <CustomTextField
                            inputProps={{ pattern: '[0-9]*' }}
                            type="number"
                            label="Wins required - 1st place *"
                            id="firstPlaceNumberOfWinsRequired"
                            value={
                              formik.values.settings?.secondStageType?.settings
                                ?.thirdPlaceNumberOfWinsRequired
                            }
                            onChange={(e) =>
                              formik.setFieldValue('settings', {
                                ...formik.values.settings,
                                secondStageType: {
                                  type: formik.values.settings.secondStageType
                                    ?.type as TournamentTypeEnum,
                                  settings: {
                                    firstPlaceNumberOfWinsRequired: Number(
                                      e.target.value,
                                    ),
                                    thirdPlaceNumberOfWinsRequired:
                                      formik.values.settings.secondStageType
                                        ?.settings
                                        .thirdPlaceNumberOfWinsRequired || 2,
                                    numberOfWinsRequired:
                                      formik.values.settings.secondStageType
                                        ?.settings.numberOfWinsRequired || 2,
                                  },
                                },
                              } satisfies TournamentSettings)
                            }
                            placeholder="2"
                            variant="outlined"
                            style={{ width: '100%' }}
                            helperText={String(formik?.errors?.name || ' ')}
                            debounceTime={200}
                            disableError
                          />
                          <CustomTextField
                            inputProps={{ pattern: '[0-9]*' }}
                            type="number"
                            label="Wins required - 3rd place *"
                            id="thirdPlaceNumberOfWinsRequired"
                            value={
                              formik.values.settings?.secondStageType?.settings
                                ?.numberOfWinsRequired
                            }
                            onChange={(e) =>
                              formik.setFieldValue('settings', {
                                ...formik.values.settings,
                                secondStageType: {
                                  type: formik.values.settings.secondStageType
                                    ?.type as TournamentTypeEnum,
                                  settings: {
                                    firstPlaceNumberOfWinsRequired:
                                      formik.values.settings.secondStageType
                                        ?.settings
                                        .firstPlaceNumberOfWinsRequired || 2,
                                    thirdPlaceNumberOfWinsRequired: Number(
                                      e.target.value,
                                    ),
                                    numberOfWinsRequired:
                                      formik.values.settings.secondStageType
                                        ?.settings.numberOfWinsRequired || 2,
                                  },
                                },
                              } satisfies TournamentSettings)
                            }
                            placeholder="2"
                            variant="outlined"
                            style={{ width: '100%' }}
                            helperText={String(formik?.errors?.name || ' ')}
                            debounceTime={200}
                            disableError
                          />
                        </>
                      )}
                  </FlexContainer>
                )}
            </>
          )}

          <CustomTextField
            inputProps={{ pattern: '[0-9]*' }}
            type="number"
            label="Number of groups *"
            id="name"
            disabled={!canEditInProgressTournament}
            value={formik.values.settings?.numberOfGroups}
            onChange={(value) =>
              formik.setFieldValue('settings', {
                ...formik.values.settings,
                numberOfGroups: Number(value.target.value),
              } satisfies TournamentSettings)
            }
            placeholder="2"
            variant="outlined"
            style={{ width: '100%', marginTop: '8px' }}
            helperText={String(formik?.errors?.name || ' ')}
            debounceTime={0}
            disableError
          />
          <CustomCheckbox
            onChange={(checked) =>
              formik.setFieldValue('settings', {
                ...formik.values.settings,
                twoWinsDifference: checked,
              } satisfies TournamentSettings)
            }
            checked={formik.values.settings?.twoWinsDifference}
            label="Win Condition: 2 point difference"
            tooltip="If this is checked, then a pair of games will play at the same time and matches will be switched every round."
          />
          {formik?.values?.settings?.numberOfGroups > 1 && (
            <CustomCheckbox
              disabled={!canEditInProgressTournament}
              onChange={(checked) =>
                formik.setFieldValue('settings', {
                  ...formik.values.settings,
                  switchGroups: checked,
                } satisfies TournamentSettings)
              }
              checked={formik.values.settings?.switchGroups}
              label="Switch groups"
              tooltip="If this is checked, then group will rotate after every finished game."
            />
          )}
          {formik?.values?.settings.firstStageType.type ===
            TournamentTypeEnum.roundRobin && (
            <CustomCheckbox
              disabled={!canEditInProgressTournament}
              onChange={(checked) =>
                formik.setFieldValue('settings', {
                  ...formik.values.settings,
                  switchGames: checked,
                } satisfies TournamentSettings)
              }
              checked={formik.values.settings?.switchGames}
              label="Switch paired games"
              tooltip="If this is checked, then a pair of games will play at the same time and matches will be switched every round."
            />
          )}

          <CustomCheckbox
            onChange={(checked) =>
              formik.setFieldValue('settings', {
                ...formik.values.settings,
                shouldInsertMatchMargins: checked,
              } satisfies TournamentSettings)
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
              } satisfies TournamentSettings)
            }
            checked={formik.values.settings?.pauseBetweenEachMatch}
            label="Pause between matches"
            tooltip="If this is checked, then timer will be stopped after each match and manual start will be required."
          />
          <Typography variant="h3">Game settings</Typography>

          <TimePicker
            disabled={!canEditInProgressTournament}
            sx={{ width: '100%' }}
            label="Game time"
            views={['minutes', 'seconds']}
            format="mm:ss"
            value={formik?.values?.gameSettings?.gameTimeInSeconds}
            onChange={(newTime) => {
              if (!newTime) {
                return;
              }
              formik.setFieldValue('gameSettings', {
                ...formik.values.gameSettings,
                gameTimeInSeconds: newTime,
              } satisfies AddGameSettings);
            }}
          />
          <FlexContainer width="100%" gap={8}>
            <TimePicker
              sx={{ width: '100%' }}
              label="Short break time"
              views={['minutes', 'seconds']}
              format="mm:ss"
              value={formik?.values?.gameSettings?.shortBreakTimeInSeconds}
              onChange={(newTime) => {
                if (!newTime) {
                  return;
                }
                formik.setFieldValue('gameSettings', {
                  ...formik.values.gameSettings,
                  shortBreakTimeInSeconds: newTime,
                } satisfies AddGameSettings);
              }}
            />
            <TimePicker
              sx={{ width: '100%' }}
              label="Long break time"
              views={['minutes', 'seconds']}
              format="mm:ss"
              value={formik?.values?.gameSettings?.longBreakTimeInSeconds}
              onChange={(newTime) => {
                if (!newTime) {
                  return;
                }
                formik.setFieldValue('gameSettings', {
                  ...formik.values.gameSettings,
                  longBreakTimeInSeconds: newTime,
                } satisfies AddGameSettings);
              }}
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
              onChange={(newTime) => {
                if (!newTime) {
                  return;
                }
                formik.setFieldValue('gameSettings', {
                  ...formik.values.gameSettings,
                  betweenGamePauseTimeInSeconds: newTime,
                } satisfies AddGameSettings);
              }}
            />
            <TimePicker
              sx={{ width: '100%' }}
              label="Countdown time for manual game start"
              views={['minutes', 'seconds']}
              format="mm:ss"
              value={formik?.values?.gameSettings?.manualGameStartTimeInSeconds}
              onChange={(newTime) => {
                if (!newTime) {
                  return;
                }
                formik.setFieldValue('gameSettings', {
                  ...formik.values.gameSettings,
                  manualGameStartTimeInSeconds: newTime,
                } satisfies AddGameSettings);
              }}
            />
          </FlexContainer>
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

export default AddOrEditTournament;
