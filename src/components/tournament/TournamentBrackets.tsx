import { Typography, css, styled } from '@mui/material';
import BracketsRoundColumn from 'components/brackets/BracketsRoundColumn';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';
import Team from 'types/Team';
import { TournamentType } from 'types/TournamentType';
import { generateGamesForEliminationBrackets } from 'utils/tournamentUtils';
import { v4 } from 'uuid';

const StyledRoundRobinCell = styled('div')(
  (props) => css`
    border-left: 1px solid ${props.theme.palette.divider};
    border-bottom: 1px solid ${props.theme.palette.divider};
    height: 70px;
    width: 70px;
  `,
);

interface IProps {
  activeLeague: League;
}

const TournamentBrackets: React.FC<IProps> = ({ activeLeague }) => {
  const selectedTournament = activeLeague?.activeTournament;
  if (!selectedTournament || !activeLeague) {
    return null;
  }

  const numberOfTeams = 5;
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
      {selectedTournament.settings.type === TournamentType.roundRobin && (
        <FlexContainer
          flexDirection="row"
          alignItems="flex-start"
          padding="20px 0px 0px 0px"
        >
          {[...Array(numberOfTeams + 1)].map((row, columnIndex) => {
            return (
              <FlexContainer flexDirection="column">
                {[...Array(numberOfTeams + 1)].map((row, rowIndex) => {
                  return (
                    <StyledRoundRobinCell>
                      {columnIndex} {rowIndex}
                    </StyledRoundRobinCell>
                  );
                })}{' '}
              </FlexContainer>
            );
          })}
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default TournamentBrackets;
