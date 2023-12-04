import { Typography } from '@mui/material';
import BracketsRoundColumn from 'components/brackets/BracketsRoundColumn';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';
import Team from 'types/Team';
import { TournamentType } from 'types/TournamentType';
import { generateGamesForEliminationBrackets } from 'utils/tournamentUtils';
import { v4 } from 'uuid';

interface IProps {
  activeLeague: League;
}

const TournamentBrackets: React.FC<IProps> = ({ activeLeague }) => {
  const selectedTournament = activeLeague?.activeTournament;
  if (!selectedTournament || !activeLeague) {
    return null;
  }

  const numberOfTeams = 8;
  const teamss: Team[] = [];
  for (let i = 0; i < numberOfTeams; i += 1) {
    const newTeam = new Team({
      _id: v4(),
      id: v4(),
      teamName: `TBD${i + 1}`,
      teamTag: `TBD${i + 1}`,
    });
    teamss.push(newTeam);
  }
  const { games, totalNumberOfRounds } = generateGamesForEliminationBrackets(
    activeLeague?.activeTournament?.teams || [],
  );

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      alignItems="flex-start"
      padding="20px 0px 0px 0px"
    >
      <Typography
        variant="body1"
        color={(theme) => theme.palette.text.disabled}
      >
        Tournament has not yet started. This is jsut a preview.{' '}
      </Typography>
      {selectedTournament.settings.type ===
        TournamentType.singleElimination && (
        <FlexContainer
          flexDirection="row"
          alignItems="flex-start"
          padding="20px 0px 0px 0px"
        >
          {[...Array(totalNumberOfRounds)].map((val, index) => {
            return (
              <BracketsRoundColumn
                isLastRound={index + 1 === totalNumberOfRounds}
                currentRoundGames={games.filter(
                  (game) => game.bracketProperties?.round === index,
                )}
                round={index}
              />
            );
          })}
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default TournamentBrackets;
