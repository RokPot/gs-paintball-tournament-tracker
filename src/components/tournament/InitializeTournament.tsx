import { Button, Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { useCallback, useState } from 'react';
import Tournament from 'types/Tournament';
import { TournamentGroup } from 'types/TournamentGroup';
import { v4 } from 'uuid';

interface IProps {
  tournament: Tournament;
}

const InitializeTournament = ({ tournament }: IProps) => {
  const [groups, setGroups] = useState(tournament.groups);
  const shuffleArray = (array: any[]) => {
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

  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      alignItems="flex-start"
      margin={16}
      width="100%"
    >
      <Typography variant="h1">Initialize {tournament.name}</Typography>

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
            <FlexContainer flexDirection="column">
              Group {group.groupIndex}
              {group?.teams.map((team) => (
                <Typography>{team.teamName}</Typography>
              ))}
            </FlexContainer>
          ))}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default InitializeTournament;
