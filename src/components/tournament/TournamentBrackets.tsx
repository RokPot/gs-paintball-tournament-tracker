import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';
import Team from 'types/Team';
import { v4 } from 'uuid';
import { ReactComponent as EmptyState } from '../../../assets/icons/EmptyInbox.svg';
import TournamentTypesPreview from './visualizations/TournamentTypesPreview';

interface IProps {
  activeLeague: League;
}
function randomColor() {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  const color = `#${hex}`;

  return color;
}
const TournamentBrackets: React.FC<IProps> = ({ activeLeague }) => {
  const selectedTournament = activeLeague?.activeTournament;

  if (!selectedTournament || !activeLeague) {
    return null;
  }

  const numberOfTeams = 0;
  const teamss: Team[] = selectedTournament.teams;
  for (let i = 0; i < numberOfTeams; i += 1) {
    const newTeam = new Team({
      _id: v4(),
      id: v4(),
      teamName: `TBD${i + 1}`,
      teamTag: `TBD${i + 1}`,
      color: randomColor(),
    });
    teamss.push(newTeam);
  }
  // const { games: roundRobinGames } = generateGamesForRoundRobin(teamss);

  // const { games: bracketGames, totalNumberOfRounds } =
  //   generateGamesForEliminationBrackets(
  //     activeLeague?.activeTournament?.teams || [],
  //   );

  if (!selectedTournament?.groups?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyState />
        <Typography variant="h3">
          Tournament has not yet been initialized.
        </Typography>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      alignItems="flex-start"
      padding="20px 0px 0px 0px"
      gap={16}
    >
      <Typography
        variant="body1"
        color={(theme) => theme.palette.text.disabled}
      >
        Tournament has not yet started. This is just a preview.{' '}
      </Typography>
      <FlexContainer
        flexDirection="row"
        gap={16}
        height="100%"
        alignItems="flex-start"
      >
        {selectedTournament?.groups
          ?.filter((group) => group.stage === selectedTournament.state.stage)
          .map((group, index) => (
            <FlexContainer
              flexDirection="column"
              alignItems="center"
              key={index}
              gap={15}
              flexWrap="wrap"
            >
              <Typography variant="h4">Group {group.groupIndex}</Typography>
              <TournamentTypesPreview group={group} />
            </FlexContainer>
          ))}
      </FlexContainer>

      {/* {selectedTournament.settings.type ===
        TournamentType.singleElimination && (
        <BracketsContainer
          games={bracketGames}
          totalNumberOfRounds={totalNumberOfRounds}
        />
      )}
      {selectedTournament.settings.type === TournamentType.roundRobin && (
        <RoundRobinContainer
          group={
            new TournamentGroup({
              games: roundRobinGames,
              teams: activeLeague?.activeTournament?.teams || [],
              id: v4(),
              groupIndex: 1,
              groupType: TournamentType.roundRobin,
              stage: 1,
              _id: v4(),
            })
          }
        />
      )} */}
    </FlexContainer>
  );
};

export default TournamentBrackets;
