import { Typography, lighten, styled, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { useEffect, useMemo, useState } from 'react';
import { GameState } from 'types/GameState';
import League from 'types/League';
import Team from 'types/Team';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { TournamentStatus } from 'types/TournamentStatus';

interface IProps {
  activeLeague?: League | null;
}

const StyledFlexContainer = styled(FlexContainer)`
  position: sticky;
  bottom: -16px;
  height: 180px;
  min-height: 180px;
  width: 100%;
  margin: 0px;
  background: ${(theme) => lighten(theme.theme?.palette?.primary.light, 0.7)};
  box-shadow: 0 -4px 4px ${(theme) => lighten(theme.theme?.palette?.primary.light, 0.5)};

  padding: 8px;
`;

const ResultsWindowUpcomingGamesSection: React.FC<IProps> = ({
  activeLeague,
}) => {
  const fontSize = 60;
  const theme = useTheme();

  const [upcomingGames, setUpcomingGames] = useState<
    TournamentScheduleGame[][]
  >([]);

  useEffect(() => {
    if (!activeLeague?.activeTournament) {
      return;
    }
    const notFinishedScheduledGames =
      activeLeague?.activeTournament.currentStage?.schedule?.filter(
        (scheduledGame) => scheduledGame.game.gameState === GameState.created,
      ) || [];
    const groupedUpcomingGames: TournamentScheduleGame[][] = [];
    for (let i = 0; i < notFinishedScheduledGames.length; ) {
      if (groupedUpcomingGames.length > 0) {
        break;
      }
      const firstGamePair = notFinishedScheduledGames[i];
      const secondGamePair = notFinishedScheduledGames[i + 1];
      if (firstGamePair?.pairedGameId === secondGamePair?.id) {
        groupedUpcomingGames.push([firstGamePair, secondGamePair]);
        i += 2;
      } else {
        groupedUpcomingGames.push([firstGamePair]);
        i += 1;
      }
    }
    setUpcomingGames(groupedUpcomingGames);
  }, [activeLeague?.activeTournament]);

  const getTeamName = (team: Team) => {
    return team.teamTag;
  };

  const currentPairedGames = useMemo(() => {
    const currentPairedGame1 =
      activeLeague?.activeTournament?.currentStage?.schedule?.find(
        (scheduledGame) =>
          scheduledGame.id ===
          activeLeague?.activeTournament?.state.pairedGame1Id,
      );
    const currentPairedGame2 =
      activeLeague?.activeTournament?.currentStage?.schedule?.find(
        (scheduledGame) =>
          scheduledGame.id ===
          activeLeague?.activeTournament?.state.pairedGame2Id,
      );
    return { game1: currentPairedGame1, game2: currentPairedGame2 };
  }, [activeLeague]);
  if (
    !activeLeague?.activeTournament ||
    activeLeague?.activeTournament.state.isTournamentFinished ||
    activeLeague?.activeTournament.state.status !== TournamentStatus.inProgress
  ) {
    return null;
  }
  return (
    <StyledFlexContainer flexDirection="column" justifyContent="space-around">
      <div>
        <Typography
          variant="p1Bold"
          marginRight="8px"
          marginLeft="8px"
          color={theme.palette.text.secondary}
          fontSize={fontSize}
        >
          {`Current ${currentPairedGames.game2 ? 'pairs' : ''}: `}
        </Typography>
        {currentPairedGames?.game1 && (
          <Typography variant="p1Medium" fontSize={fontSize}>
            {getTeamName(currentPairedGames.game1.game.team1) || 'TBD'}
            <Typography
              variant="p1"
              style={{ textDecoration: 'none' }}
              fontSize={fontSize - 20}
            >
              {' vs '}
            </Typography>
            {getTeamName(currentPairedGames?.game1.game.team2) || 'TBD'}
          </Typography>
        )}
        {currentPairedGames?.game2 && (
          <>
            <Typography padding="0px 4px" fontSize={fontSize - 20}>
              {', '}
            </Typography>
            <Typography variant="p1Medium" fontSize={fontSize}>
              {currentPairedGames?.game2.game.team1.teamName || 'TBD'}
              <Typography
                variant="p1"
                style={{ textDecoration: 'none' }}
                fontSize={fontSize - 20}
              >
                {' vs '}
              </Typography>
              {currentPairedGames?.game2.game.team2.teamName || 'TBD'}
            </Typography>
          </>
        )}
      </div>
      {upcomingGames.map((upcomingGamePairs, index) => {
        const pairedGame1 = upcomingGamePairs[0];
        const pairedGame2 = upcomingGamePairs[1];
        return (
          <div key={index}>
            <Typography
              variant="p1Bold"
              marginRight="8px"
              marginLeft="8px"
              color={theme.palette.text.secondary}
              fontSize={fontSize}
            >
              {index === 0
                ? `Next ${pairedGame2 ? 'pair' : ''}: `
                : `Upcoming ${pairedGame2 ? 'pair' : ''}: `}
            </Typography>
            <Typography variant="p1Medium" fontSize={fontSize}>
              {getTeamName(pairedGame1.game.team1) || 'TBD'}
              <Typography
                variant="p1"
                style={{ textDecoration: 'none' }}
                fontSize={fontSize - 20}
              >
                {' vs '}
              </Typography>
              {getTeamName(pairedGame1.game.team2) || 'TBD'}
            </Typography>
            {pairedGame2 && (
              <>
                <Typography padding="0px 4px" fontSize={fontSize - 20}>
                  {', '}
                </Typography>
                <Typography variant="p1Medium" fontSize={fontSize}>
                  {pairedGame2.game.team1.teamName || 'TBD'}
                  <Typography
                    variant="p1"
                    style={{ textDecoration: 'none' }}
                    fontSize={fontSize - 20}
                  >
                    {' vs '}
                  </Typography>
                  {pairedGame2.game.team2.teamName || 'TBD'}
                </Typography>
              </>
            )}
          </div>
        );
      })}
    </StyledFlexContainer>
  );
};

export default ResultsWindowUpcomingGamesSection;
