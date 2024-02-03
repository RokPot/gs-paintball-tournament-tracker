import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { useCallback, useEffect, useState } from 'react';
import Game from 'types/Game';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentScheduleGame } from 'types/TournamentScheduleGame';
import { TournamentSettings } from 'types/TournamentSettings';
import { TournamentType, TournamentTypeLabels } from 'types/TournamentType';
import { shuffleArray } from 'utils/arrayUtils';
import { generateGamesForRoundRobin } from 'utils/tournament/roundRobinUtils';
import {
  generateGamesForEliminationBrackets,
  generateTournamentSchedule,
} from 'utils/tournamentUtils';
import { v4 } from 'uuid';
import TournamentGroupCard from './TournamentGroupCard';
import TournamentTypesPreview from './visualizations/TournamentTypesPreview';

function randomColor() {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  const color = `#${hex}`;

  return color;
}

interface IProps {
  tournament: Tournament;
  className?: string;
  onConfirm: (
    groups: TournamentGroup[],
    settings: TournamentSettings,
    schedule: TournamentScheduleGame[],
  ) => void;
}

const InitializeTournament: React.FC<IProps> = ({
  tournament,
  className,
  onConfirm,
}) => {
  const [groups, setGroups] = useState(tournament.groups);
  const [schedule, setSchedule] = useState(tournament.schedule || []);
  const [totalNumberOfRounds, setTotalNumberOfRounds] = useState(0);
  const [tournamentSettings, setTournamentSettings] = useState(
    tournament.settings,
  );
  const theme = useTheme();

  const generateNewGroups = useCallback(() => {
    const numberOfGroups = tournamentSettings.numberOfGroups || 1;
    const shuffledTeams = shuffleArray(tournament.teams);
    const newGroups: TournamentGroup[] = [];

    // set new empty groups
    for (let i = 0; i < numberOfGroups; i += 1) {
      const newId = v4();
      newGroups.push(
        new TournamentGroup({
          games: [],
          groupIndex: i + 1,
          _id: newId,
          id: newId,
          teams: [],
          groupType: tournamentSettings.type,
          stage: 1,
        }),
      );
    }

    // push teams to groups
    for (let i = 0, groupIndex = 0; i < shuffledTeams.length; i += 1) {
      newGroups[groupIndex].teams.push(shuffledTeams[i]);
      groupIndex = groupIndex + 1 >= numberOfGroups ? 0 : groupIndex + 1;
    }

    if (tournamentSettings.type === TournamentType.roundRobin) {
      for (let i = 0; i < newGroups.length; i += 1) {
        if (newGroups[i].teams.length > 1) {
          const { games: roundRobinGames } = generateGamesForRoundRobin(
            newGroups[i].teams,
            tournament.gameSettings,
          );
          newGroups[i].games = roundRobinGames;
        }
      }
    }

    if (numberOfGroups > 1) {
      const nextStageTeams: Team[] = [];
      const nextStageGames: Game[] = [];
      for (let i = 0; i < numberOfGroups; i += 1) {
        nextStageTeams.push(
          new Team({
            _id: `G${i + 1}#1`,
            id: `G${i + 1}#1`,
            teamName: `Group${i + 1} #1`,
            teamTag: `Group${i + 1} #1`,
            color: randomColor(),
          }),
          new Team({
            _id: `G${i + 1}#2`,
            id: `G${i + 1}#2`,
            teamName: `Group${i + 1} #2`,
            teamTag: `Group${i + 1} #2`,
            color: randomColor(),
          }),
        );
      }

      if (tournamentSettings.secondStageType === TournamentType.roundRobin) {
        const { games: roundRobinGames } = generateGamesForRoundRobin(
          nextStageTeams,
          tournament.gameSettings,
        );
        nextStageGames.push(...roundRobinGames);
      }
      if (
        tournamentSettings.secondStageType === TournamentType.singleElimination
      ) {
        const [firstSeedTeams, lowerSeedTeams] = nextStageTeams.reduce(
          (teamArr: [Team[], Team[]], team: Team) => {
            teamArr[team.teamName.includes('#1') ? 0 : 1].push(team);
            return teamArr;
          },
          [[], []],
        );

        const {
          games: bracketGames,
          totalNumberOfRounds: numberOfBracketRounds,
        } = generateGamesForEliminationBrackets(
          [...shuffleArray(firstSeedTeams), ...shuffleArray(lowerSeedTeams)],
          tournament.gameSettings,
        );
        nextStageGames.push(...bracketGames);
        setTotalNumberOfRounds(numberOfBracketRounds);
      }
      if (
        tournamentSettings.secondStageType === TournamentType.doubleElimination
      ) {
        const { games: bracketGames } = generateGamesForEliminationBrackets(
          nextStageTeams,
          tournament.gameSettings,
        );
        nextStageGames.push(...bracketGames);
      }
      const newId = v4();
      newGroups.push(
        new TournamentGroup({
          games: nextStageGames,
          groupIndex: newGroups.length + 1,
          id: newId,
          _id: newId,
          teams: nextStageTeams,
          groupType:
            tournamentSettings.secondStageType || TournamentType.roundRobin,
          stage: 2,
        }),
      );
    }
    return newGroups;
  }, [
    tournamentSettings.numberOfGroups,
    tournamentSettings.type,
    tournamentSettings.secondStageType,
    tournament.teams,
    tournament.gameSettings,
  ]);

  const confirmTournamentSettings = () => {
    onConfirm(
      groups,
      { ...tournament.settings, ...tournamentSettings },
      schedule,
    );
  };
  const generateNewTournamentDraft = useCallback(() => {
    const newGroups = generateNewGroups();
    const newSchedule = generateTournamentSchedule(
      newGroups,
      tournament.settings,
    );
    setGroups(newGroups);
    setSchedule(newSchedule);
  }, [generateNewGroups, tournament.settings]);

  useEffect(() => {
    generateNewTournamentDraft();
  }, [generateNewTournamentDraft]);

  return (
    <FlexContainer
      padding="16px 16px 0px 16px"
      flexDirection="column"
      alignItems="flex-start"
      gap={16}
      width="100%"
      className={className}
    >
      <FlexContainer flexDirection="row" width="100%" gap={8} height="70px">
        <FormControl>
          <InputLabel>Number of groups</InputLabel>

          <Select
            style={{ width: '150px' }}
            value={tournamentSettings.numberOfGroups}
            label="Number of groups"
            onChange={(e) => {
              setTournamentSettings((curr) => ({
                ...curr,
                numberOfGroups: Number(e.target.value),
              }));
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
            value={tournamentSettings.type}
            label="Stage 1 Tournament Type"
            onChange={(e) => {
              setTournamentSettings((curr) => ({
                ...curr,
                type: e.target.value as TournamentType,
              }));
            }}
          >
            {Object.values(TournamentType).map((tournamentKey, index) => (
              <MenuItem key={index} value={tournamentKey}>
                {TournamentTypeLabels[tournamentKey]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {tournamentSettings.numberOfGroups > 1 && (
          <FormControl>
            <InputLabel>Stage 2 Tournament Type</InputLabel>
            <Select
              style={{ width: '250px' }}
              value={tournamentSettings.secondStageType}
              label="Stage 2 Tournament Type"
              onChange={(e) => {
                setTournamentSettings((curr) => ({
                  ...curr,
                  secondStageType: e.target.value as TournamentType,
                }));
              }}
            >
              {Object.values(TournamentType).map((tournamentKey, index) => (
                <MenuItem key={index} value={tournamentKey}>
                  {TournamentTypeLabels[tournamentKey]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </FlexContainer>

      <FlexContainer flexDirection="column" width="100%" height="100%">
        <FlexContainer
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="h3">Teams</Typography>
          <Button onClick={generateNewTournamentDraft}>Shuffle</Button>
        </FlexContainer>
        {tournamentSettings.numberOfGroups > 1 && (
          <Typography variant="h4Medium" width="100%" marginLeft="16px">
            Stage 1
          </Typography>
        )}
        <FlexContainer
          flexDirection="row"
          alignItems="flex-start"
          width="100%"
          flexWrap="wrap"
          gap={16}
        >
          {groups
            ?.filter((group) => group.stage === 1)
            .map((group, index) => (
              <FlexContainer
                flexDirection="row"
                alignItems="center"
                key={index}
                gap={15}
              >
                <TournamentGroupCard group={group} />

                <TournamentTypesPreview group={group} />
              </FlexContainer>
            ))}
        </FlexContainer>
        {tournamentSettings.numberOfGroups > 1 && groups?.length > 1 && (
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
              <TournamentGroupCard group={groups[groups.length - 1]} />

              <TournamentTypesPreview
                group={groups[groups.length - 1]}
                totalNumberOfRounds={totalNumberOfRounds}
              />
            </FlexContainer>
          </FlexContainer>
        )}
      </FlexContainer>
      <FlexContainer
        width="100%"
        justifyContent="flex-end"
        style={{
          borderTop: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.default,
          zIndex: 2,
        }}
        padding="8px"
        position="sticky"
        bottom="0px"
      >
        <Button variant="contained" onClick={confirmTournamentSettings}>
          Initialize tournament
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
};

export default InitializeTournament;
