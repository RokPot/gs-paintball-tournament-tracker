import { faEdit, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import {
  Theme,
  Tooltip,
  Typography,
  alpha,
  css,
  styled,
  useTheme,
} from '@mui/material';
import AddOrEditGame from 'components/game/AddOrEditGame';
import CustomDropdownMenu from 'components/shared/CustomDropdownMenu';
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import useGameQueries from 'hooks/game/useGameQueries';
import { useState } from 'react';
import Game from 'types/Game';
import { GameState, GameStateLabels } from 'types/GameState';
import League from 'types/League';
import { TournamentScheduleGame } from 'types/TournamentScheduleGame';
import { ReactComponent as EmptyState } from '../../../assets/icons/EmptyInbox.svg';

const StyledGameContainer = styled('div')(
  (props) => css`
    /* border: solid 1px ${props.theme.palette.divider}; */
    padding: 8px;
    border-radius: 3px;
    /*box-shadow: 0px 0px 5px 0px ${alpha(
      props.theme.palette.primary.light,
      0.4,
    )};*/
    width: 100%;
    &:hover {
      background: ${props.theme.palette.grey[200]};
    }
  `,
);

const StyledScoreCardContainer = styled('div')(
  (props) => css`
    padding: 4px;
    border-radius: 3px;
    background: ${props.theme.palette.primary.light};
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
);

interface IStyledGameStatusCircleProps {
  color?: string;
  shouldAnimate?: boolean;
}

const StyledGameStatusCircle = styled('div')(
  (props: IStyledGameStatusCircleProps & { theme?: Theme }) => css`
    border-radius: 10px;
    height: 13px;
    width: 13px;

    background-color: ${props.color};
    margin: 4px;
  `,
);

const StyledAnimatedGameStatusCircle = styled(StyledGameStatusCircle)(
  (props: IStyledGameStatusCircleProps & { theme?: Theme }) => css`
    -webkit-animation: glow linear 5s infinite;
    animation: glow linear 5s infinite;
    ${props.shouldAnimate &&
    `@-webkit-keyframes glow {
      0% {
        background-color: transparent;
      }
      50% {
        background-color: ${props.color};
      }
      100% {
        background-color: transparent;
      }
    }
    @keyframes glow {
      0% {
        background-color: transparent;
      }
      50% {
        background-color: ${props.color};
      }
      100% {
        background-color: transparent;
      }
    }`}
  `,
);

const StyledDivider = styled('div')`
  border-bottom: 0.5px solid ${({ theme }) => theme.palette.primary.light};
  width: 100%;
  height: 1px;
`;
// todo rokpot better processing
interface ScheduleRow {
  scheduledGame: TournamentScheduleGame;
  previousGroupIndex?: number;
  nextGroupIndex?: number;
}

interface IProps {
  activeLeague: League;
}

const ScheduleContainer = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague.activeTournament!;
  const { updateGameWithMatchesAndRecalculate } = useGameQueries();
  const [gameForEditModal, setGameForEditModal] = useState<Game>();
  const theme = useTheme();
  const { switchGames, numberOfTeamSize } = selectedTournament.settings;
  const getGameStatusColor = (gameState: GameState) => {
    switch (gameState) {
      case GameState.finished:
        return theme.palette.error.main;
      case GameState.playing:
        return theme.palette.success.main;
      case GameState.waiting:
        return theme.palette.warning.main;
      default:
        return 'blue';
    }
  };

  const onEditGame = (game: Game) => {
    setGameForEditModal(game);
  };

  const closeModal = () => {
    setGameForEditModal(undefined);
    setGameForEditModal(undefined);
  };

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

  if (!selectedTournament?.schedule?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyState />
        <Typography variant="h3">No schedule.</Typography>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      justifyContent="flex-start"
      alignItems="flex-start"
      gap={8}
    >
      {selectedTournament?.schedule?.map((sched, index) => {
        const isPreviousGroupDifferent =
          index > 0 &&
          selectedTournament!.schedule?.[index - 1].group.groupIndex !==
            selectedTournament.schedule?.[index].group.groupIndex;

        const isFirstRow = index === 0;
        const shouldPairGames =
          !isPreviousGroupDifferent && index % (switchGames ? 2 : 1) === 0;
        return (
          <FlexContainer
            flexDirection="column"
            width="100%"
            justifyContent="flex-start"
            alignItems="flex-start"
            gap={8}
            key={sched.id}
          >
            {index > 0 && index % 2 === 0 && (
              <StyledDivider key={`${index}1`} />
            )}
            {(isPreviousGroupDifferent || isFirstRow || shouldPairGames) && (
              <Typography
                variant="p1Medium"
                textAlign="start"
                key={`${index}2`}
              >
                {(isPreviousGroupDifferent || isFirstRow) &&
                  `Group${sched.group.groupIndex}`}
              </Typography>
            )}
            <StyledGameContainer key={`${index}3`}>
              <FlexContainer
                alignItems="center"
                width="100%"
                height="100%"
                gap={8}
              >
                <Typography
                  variant="h6Medium"
                  textAlign="end"
                  marginBottom="0px"
                >
                  Game: {sched.gameNumber}
                </Typography>

                <Typography variant="p1" minWidth="100px" textAlign="end">
                  {sched.game.team1.teamName}
                </Typography>
                <StyledScoreCardContainer>
                  <Typography
                    variant="p1Bold"
                    color={theme.palette.common.white}
                  >
                    {sched.game.team1Wins}
                  </Typography>
                </StyledScoreCardContainer>

                <Typography variant="p2Medium">VS</Typography>

                <StyledScoreCardContainer>
                  <Typography
                    variant="p1Bold"
                    color={theme.palette.common.white}
                  >
                    {sched.game.team2Wins}
                  </Typography>
                </StyledScoreCardContainer>
                <Typography variant="p1">
                  {sched.game.team2.teamName}
                </Typography>
                {[
                  GameState.finished,
                  GameState.playing,
                  GameState.waiting,
                ].includes(sched.game.gameState) && (
                  <Tooltip title={GameStateLabels[sched.game.gameState]} arrow>
                    {sched.game.gameState === GameState.finished ? (
                      <StyledGameStatusCircle
                        color={theme.palette.error.main}
                      />
                    ) : (
                      <StyledAnimatedGameStatusCircle
                        shouldAnimate
                        color={getGameStatusColor(sched.game.gameState)}
                      />
                    )}
                  </Tooltip>
                )}

                {sched?.game?.gameState === GameState.finished && (
                  <div style={{ marginLeft: 'auto' }}>
                    <CustomDropdownMenu
                      icon={faEllipsisVertical}
                      actions={[
                        {
                          label: 'Edit game',
                          icon: faEdit,
                          onClick: () => {
                            onEditGame(sched.game);
                          },
                          visible: true,
                        },
                      ]}
                    />
                  </div>
                )}
              </FlexContainer>
            </StyledGameContainer>
          </FlexContainer>
        );
      })}
      <CustomModal isModalOpen={!!gameForEditModal} width={600}>
        {gameForEditModal && (
          <AddOrEditGame
            game={gameForEditModal}
            onConfirm={async (updatedGame) => {
              await updateGameWithMatchesAndRecalculate(updatedGame);
              closeModal();
            }}
            sizeOfTeams={numberOfTeamSize}
            onClose={closeModal}
          />
        )}
      </CustomModal>
    </FlexContainer>
  );
};

export default ScheduleContainer;
