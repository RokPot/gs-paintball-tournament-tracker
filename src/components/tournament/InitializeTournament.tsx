import { LoadingButton } from '@mui/lab';
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
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import { TournamentSettings } from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';
import { TournamentType, TournamentTypeLabels } from 'types/TournamentType';
import { shuffleArray } from 'utils/arrayUtils';
import { generateNewStage } from 'utils/tournamentUtils';
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
    stages: TournamentStage,
    settings: TournamentSettings,
  ) => Promise<void>;
}

const InitializeTournament: React.FC<IProps> = ({
  tournament,
  className,
  onConfirm,
}) => {
  const [stages, setStages] = useState(tournament.stages);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tournamentSettings, setTournamentSettings] = useState(
    tournament.settings,
  );
  const theme = useTheme();

  const generateNewStages = useCallback(
    (newTournamentSettings: TournamentSettings) => {
      const numberOfGroups = newTournamentSettings.numberOfGroups || 1;
      const shuffledTeams = shuffleArray(tournament.teams);

      const newStages: TournamentStage[] = [];
      const newInitialStage = generateNewStage(
        shuffledTeams,
        1,
        numberOfGroups,
        tournament.settings.type,
        tournament,
      );
      newStages.push(newInitialStage);

      if (numberOfGroups > 1) {
        let nextStageTeams: Team[] = [];
        // Prepare preview for second stage
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

        if (
          newTournamentSettings.secondStageType ===
          TournamentType.singleElimination
        ) {
          const [firstSeedTeams, lowerSeedTeams] = nextStageTeams.reduce(
            (teamArr: [Team[], Team[]], team: Team) => {
              teamArr[team.teamName.includes('#1') ? 0 : 1].push(team);
              return teamArr;
            },
            [[], []],
          );
          nextStageTeams = [
            ...shuffleArray(firstSeedTeams),
            ...shuffleArray(lowerSeedTeams),
          ];
        }

        const newSecondStage = generateNewStage(
          nextStageTeams,
          2,
          1,
          tournament?.settings?.secondStageType ||
            TournamentType.singleElimination,
          tournament,
        );
        newStages.push(newSecondStage);
      }
      return newStages;
    },
    [tournament],
  );

  const confirmTournamentSettings = async () => {
    try {
      if (!stages?.length) {
        return;
      }
      setIsProcessing(true);
      // Only the first is necessary others are for preview
      onConfirm(stages[0], { ...tournament.settings, ...tournamentSettings });
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateNewTournamentDraft = useCallback(
    (newTournamentSettings: TournamentSettings) => {
      const newStages = generateNewStages(newTournamentSettings);

      setTournamentSettings(newTournamentSettings);
      setStages(newStages);
    },
    [generateNewStages],
  );

  useEffect(() => {
    generateNewTournamentDraft(tournamentSettings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              generateNewTournamentDraft({
                ...tournamentSettings,
                numberOfGroups: Number(e.target.value),
              });
            }}
          >
            {[1, 2, 3, 4, 5, 6]
              .filter(
                (val) => val === 1 || tournament?.teams?.length >= val * 2,
              )
              .map((numberOfGroups, index) => (
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
              generateNewTournamentDraft({
                ...tournamentSettings,
                type: e.target.value as TournamentType,
              });
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
                generateNewTournamentDraft({
                  ...tournamentSettings,
                  secondStageType: e.target.value as TournamentType,
                });
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
          <Button
            onClick={() => generateNewTournamentDraft(tournamentSettings)}
          >
            Shuffle
          </Button>
        </FlexContainer>
        {stages?.map((tournamentStage, index) => (
          <FlexContainer flexDirection="column" width="100%" key={index}>
            <Typography variant="h4Medium" width="100%" marginLeft="16px">
              Stage {index + 1}
            </Typography>
            <FlexContainer
              flexDirection="row"
              alignItems="flex-start"
              width="100%"
              flexWrap="wrap"
              gap={16}
            >
              {tournamentStage.groups.map((group, groupIndex) => (
                <FlexContainer
                  flexDirection="row"
                  alignItems="center"
                  key={groupIndex}
                  gap={15}
                >
                  <TournamentGroupCard group={group} />

                  <TournamentTypesPreview group={group} />
                </FlexContainer>
              ))}
            </FlexContainer>
          </FlexContainer>
        ))}
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
        <LoadingButton
          loading={isProcessing}
          variant="contained"
          onClick={confirmTournamentSettings}
        >
          Initialize tournament
        </LoadingButton>
      </FlexContainer>
    </FlexContainer>
  );
};

export default InitializeTournament;
