import {
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  alpha,
  styled,
  useTheme,
} from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import Game from 'types/Game';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import { TournamentGroup } from 'types/TournamentGroup';
import { TournamentSettings } from 'types/TournamentSettings';
import { TournamentType, TournamentTypeLabels } from 'types/TournamentType';
import { shuffleArray } from 'utils/arrayUtils';
import { generateGamesForRoundRobin } from 'utils/tournament/roundRobinUtils';
import { generateGamesForEliminationBrackets } from 'utils/tournamentUtils';
import { v4 } from 'uuid';
import TournamentTypesPreview from './visualizations/TournamentTypesPreview';

function randomColor() {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  const color = `#${hex}`;

  return color;
}

interface IProps {
  tournament: Tournament;
  className?: string;
}

const InitializeTournament: React.FC<IProps> = ({ tournament, className }) => {
  const [groups, setGroups] = useState(tournament.groups);
  const [totalNumberOfRounds, setTotalNumberOfRounds] = useState(0);
  const theme = useTheme();

  const formik = useFormik<TournamentSettings>({
    initialValues: tournament.settings,
    onSubmit: (settings) => {
      console.log(settings);
    },
  });

  const generateNewGroups = useCallback(
    (numberOfGroups: number) => {
      const shuffledTeams = shuffleArray(tournament.teams);
      const newGroups: TournamentGroup[] = [];

      // set new empty groups
      for (let i = 0; i < numberOfGroups; i += 1) {
        newGroups.push({
          games: [],
          groupIndex: i + 1,
          id: v4(),
          teams: [],
          groupType: formik?.values?.type,
          stage: 1,
        });
      }

      // push teams to groups
      for (let i = 0, groupIndex = 0; i < shuffledTeams.length; i += 1) {
        newGroups[groupIndex].teams.push(shuffledTeams[i]);
        groupIndex = groupIndex + 1 >= numberOfGroups ? 0 : groupIndex + 1;
      }

      if (formik?.values?.type === TournamentType.roundRobin) {
        for (let i = 0; i < newGroups.length; i += 1) {
          if (newGroups[i].teams.length > 1) {
            const { games: roundRobinGames } = generateGamesForRoundRobin(
              newGroups[i].teams,
            );
            newGroups[i].games = roundRobinGames;
          }
        }
      }

      if (numberOfGroups > 1) {
        const nextStageTeams: Team[] = [];
        const nextStageGames: Game[] = [];
        for (let i = 0; i < numberOfGroups * 2; i += 1) {
          nextStageTeams.push(
            new Team({
              _id: v4(),
              id: v4(),
              teamName: 'TBD',
              teamTag: 'TBD',
              color: randomColor(),
            }),
          );
        }
        if (formik?.values?.secondStageType === TournamentType.roundRobin) {
          const { games: roundRobinGames } =
            generateGamesForRoundRobin(nextStageTeams);
          nextStageGames.push(...roundRobinGames);
        }
        if (
          formik?.values?.secondStageType === TournamentType.singleElimination
        ) {
          const {
            games: bracketGames,
            totalNumberOfRounds: numberOfBracketRounds,
          } = generateGamesForEliminationBrackets(nextStageTeams);
          nextStageGames.push(...bracketGames);
          setTotalNumberOfRounds(numberOfBracketRounds);
        }
        if (
          formik?.values?.secondStageType === TournamentType.doubleElimination
        ) {
          const { games: bracketGames } =
            generateGamesForEliminationBrackets(nextStageTeams);
          nextStageGames.push(...bracketGames);
        }
        newGroups.push({
          games: nextStageGames,
          groupIndex: newGroups.length + 1,
          id: v4(),
          teams: nextStageTeams,
          groupType:
            formik?.values?.secondStageType || TournamentType.roundRobin,
          stage: 2,
        });
      }
      setGroups(newGroups);
    },
    [formik?.values?.secondStageType, formik?.values?.type, tournament.teams],
  );

  useEffect(() => {
    generateNewGroups(tournament.settings.numberOfGroups);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      alignItems="flex-start"
      margin={16}
      width="100%"
      className={className}
    >
      <FlexContainer flexDirection="row" width="100%" margin={8}>
        <FormControl>
          <InputLabel>Number of groups</InputLabel>

          <Select
            style={{ width: '150px' }}
            value={formik?.values?.numberOfGroups}
            label="Number of groups"
            onChange={(e) => {
              formik.setFieldValue('numberOfGroups', Number(e.target.value));
              generateNewGroups(Number(e.target.value));
            }}
          >
            {[1, 2, 3, 4, 5, 6]?.map((numberOfGroups, index) => (
              <MenuItem key={index} value={numberOfGroups}>
                {numberOfGroups}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Stage 1 Tournament Type</InputLabel>
          <Select
            style={{ width: '250px' }}
            value={formik?.values?.type}
            label="Stage 1 Tournament Type"
            onChange={(e) => {
              formik.setFieldValue('type', e.target.value as TournamentType);
            }}
          >
            {Object.values(TournamentType).map((tournamentKey, index) => (
              <MenuItem key={index} value={tournamentKey}>
                {TournamentTypeLabels[tournamentKey]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Stage 2 Tournament Type</InputLabel>
          <Select
            style={{ width: '250px' }}
            value={formik?.values?.secondStageType}
            label="Stage 2 Tournament Type"
            onChange={(e) => {
              formik.setFieldValue(
                'secondStageType',
                e.target.value as TournamentType,
              );
            }}
          >
            {Object.values(TournamentType).map((tournamentKey, index) => (
              <MenuItem key={index} value={tournamentKey}>
                {TournamentTypeLabels[tournamentKey]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FlexContainer>

      <FlexContainer flexDirection="column" width="100%">
        <FlexContainer
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="h3">Teams</Typography>
          <Button
            onClick={() => generateNewGroups(formik?.values?.numberOfGroups)}
          >
            Shuffle
          </Button>
        </FlexContainer>
        {formik?.values?.numberOfGroups > 1 && (
          <Typography variant="h4Medium" width="100%" marginLeft="16px">
            Stage 1
          </Typography>
        )}
        <FlexContainer
          flexDirection="row"
          alignItems="flex-start"
          width="100%"
          flexWrap="wrap"
          margin={16}
        >
          {groups
            .filter((group) => group.stage === 1)
            .map((group, index) => (
              <FlexContainer flexDirection="row" alignItems="center">
                <Card className="custom-card counter-card" key={index}>
                  <FlexContainer flexDirection="column">
                    <FlexContainer
                      width="100%"
                      flexDirection="row"
                      justifyContent="space-between"
                      style={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="h3Medium" width="100%">
                        Group {group.groupIndex}
                      </Typography>
                    </FlexContainer>

                    <FlexContainer
                      highlightRowOnHover
                      flexDirection="column"
                      width="100%"
                    >
                      {group?.teams.map((team) => (
                        <div style={{ padding: '8px', width: '100%' }}>
                          <Typography>{team.teamName}</Typography>
                        </div>
                      ))}
                    </FlexContainer>
                  </FlexContainer>
                </Card>
                <TournamentTypesPreview group={group} />
              </FlexContainer>
            ))}
        </FlexContainer>
        {formik?.values?.numberOfGroups > 1 && (
          <FlexContainer
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-start"
            width="100%"
          >
            <Typography variant="h4Medium" width="100%" marginLeft="16px">
              Stage 2
            </Typography>
            <FlexContainer
              flexDirection="row"
              alignItems="center"
              width="100%"
              justifyContent="flex-start"
            >
              <Card className="custom-card counter-card">
                <FlexContainer flexDirection="column">
                  <FlexContainer
                    width="100%"
                    flexDirection="row"
                    justifyContent="space-between"
                    style={{
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="h3Medium" width="100%">
                      Finals
                    </Typography>
                  </FlexContainer>

                  <FlexContainer
                    highlightRowOnHover
                    flexDirection="column"
                    width="100%"
                  >
                    {groups[groups.length - 1]?.teams.map((team) => (
                      <div style={{ padding: '8px', width: '100%' }}>
                        <Typography>{team.teamName}</Typography>
                      </div>
                    ))}
                  </FlexContainer>
                </FlexContainer>
              </Card>
              <TournamentTypesPreview
                group={groups[groups.length - 1]}
                totalNumberOfRounds={totalNumberOfRounds}
              />
            </FlexContainer>
          </FlexContainer>
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default styled(InitializeTournament)(
  (props) => `
    .custom-card {
      box-shadow: ${alpha(props.theme.palette.primary.main, 0.5)} 0px 5px 15px;
      border: solid 1px ${alpha(props.theme.palette.primary.main, 0.2)};
      margin: 8px;
      padding: 16px;
      min-width: 200px;
      min-height: 300px;
    }
  `,
);
