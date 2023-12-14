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
import { useCallback, useState } from 'react';
import Tournament from 'types/Tournament';
import { TournamentGroup } from 'types/TournamentGroup';
import { TournamentSettings } from 'types/TournamentSettings';
import { TournamentType, TournamentTypeLabels } from 'types/TournamentType';
import { v4 } from 'uuid';

interface IProps {
  tournament: Tournament;
  className?: string;
}

const InitializeTournament: React.FC<IProps> = ({ tournament, className }) => {
  const [groups, setGroups] = useState(tournament.groups);
  const theme = useTheme();
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  const shuffleTeams = useCallback(() => {
    const shuffledTeams = shuffleArray(tournament.teams);
    const newGroups: TournamentGroup[] = [];

    for (let i = 0; i < tournament.settings.numberOfGroups; i += 1) {
      newGroups.push({ games: [], groupIndex: i + 1, id: v4(), teams: [] });
    }
    for (let i = 0, groupIndex = 0; i < shuffledTeams.length; i += 1) {
      newGroups[groupIndex].teams.push(shuffledTeams[i]);
      groupIndex =
        groupIndex + 1 >= tournament.settings.numberOfGroups
          ? 0
          : groupIndex + 1;
    }
    setGroups(newGroups);
  }, [tournament.settings.numberOfGroups, tournament.teams]);
  const formik = useFormik<TournamentSettings>({
    initialValues: tournament.settings,
    onSubmit: (settings) => {
      console.log(settings);
    },
  });

  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      alignItems="flex-start"
      margin={16}
      width="100%"
      className={className}
    >
      <Typography variant="h1">Initialize {tournament.name}</Typography>
      <FlexContainer flexDirection="row" width="100%">
        <FormControl fullWidth>
          <InputLabel>Number of groups</InputLabel>

          <Select
            value={formik?.values?.numberOfGroups}
            label="Number of groups"
            onChange={(e) => {
              formik.setFieldValue('numberOfGroups', Number(e.target.value));
              tournament.settings.numberOfGroups = Number(e.target.value);
              shuffleTeams();
            }}
          >
            {[1, 2, 3, 4, 5, 6]?.map((numberOfGroups, index) => (
              <MenuItem key={index} value={numberOfGroups}>
                {numberOfGroups}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={tournament?.settings.type}
            label="Type"
            onChange={(e) => {
              tournament.settings.type = e.target.value as TournamentType;
            }}
          >
            {Object.values(TournamentType)?.map((tournamentKey, index) => (
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
          <Button onClick={shuffleTeams}>Shuffle</Button>
        </FlexContainer>
        <FlexContainer flexDirection="row">
          {groups.map((group) => (
            <Card className="custom-card counter-card">
              <FlexContainer flexDirection="column">
                <Typography
                  variant="h3Medium"
                  borderBottom={`1px solid ${theme.palette.divider}`}
                  width="100%"
                >
                  Group {group.groupIndex}
                </Typography>

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
          ))}
        </FlexContainer>
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
