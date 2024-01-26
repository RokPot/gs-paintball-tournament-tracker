import {
  faEdit,
  faEllipsisVertical,
  faInfo,
} from '@fortawesome/free-solid-svg-icons';
import {
  Theme,
  Tooltip,
  Typography,
  alpha,
  css,
  styled,
  useTheme,
} from '@mui/material';
import CustomDropdownMenu from 'components/shared/CustomDropdownMenu';
import FlexContainer from 'components/shared/FlexContainer';
import { useEffect, useState } from 'react';
import { GameState, GameStateLabels } from 'types/GameState';
import League from 'types/League';
import { TournamentSchedule as Schedule } from 'types/TournamentSchedule';
import { generateTournamentSchedule } from 'utils/tournamentUtils';
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
    -webkit-animation: glow linear 5s infinite;
    animation: glow linear 5s infinite;
    background-color: ${props.color};
    margin: 4px;
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

interface IProps {
  activeLeague: League;
}

const TournamentScheduleContainer = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const theme = useTheme();
  const switchGroups = true;
  const switchGames = false;

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

  useEffect(() => {
    setSchedule(
      generateTournamentSchedule(
        selectedTournament?.groups,
        selectedTournament?.settings,
      ),
    );
  }, []);

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
      justifyContent="flex-start"
      alignItems="flex-start"
      gap={8}
    >
      {schedule?.map((sched, index) => {
        const isPreviousGroupDifferent =
          index > 0 &&
          schedule[index - 1].group.groupIndex !==
            schedule[index].group.groupIndex;

        const isFirstRow = index === 0;
        const shouldPairGames =
          !isPreviousGroupDifferent && index % (switchGames ? 2 : 1) === 0;
        return (
          <>
            {index > 0 && index % 2 === 0 && (
              <div
                style={{
                  borderBottom: `0.5px solid ${theme.palette.primary.light}`,
                  width: '100%',
                  height: '1px',
                }}
              />
            )}
            {(isPreviousGroupDifferent || isFirstRow || shouldPairGames) && (
              <Typography variant="p1Medium" textAlign="start">
                {(isPreviousGroupDifferent || isFirstRow) &&
                  `Group${sched.group.groupIndex}`}
              </Typography>
            )}
            <StyledGameContainer>
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
                  <Typography variant="p1Bold">
                    {sched.game.team2Wins}
                  </Typography>
                </StyledScoreCardContainer>

                <Typography variant="p2Medium">VS</Typography>

                <StyledScoreCardContainer>
                  <Typography variant="p1Bold">
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
                    <StyledGameStatusCircle
                      shouldAnimate={
                        sched.game.gameState !== GameState.finished
                      }
                      color={getGameStatusColor(sched.game.gameState)}
                    />
                  </Tooltip>
                )}

                <div style={{ marginLeft: 'auto' }}>
                  <CustomDropdownMenu
                    icon={faEllipsisVertical}
                    actions={[
                      {
                        label: 'Edit game',
                        icon: faEdit,
                        onClick: () => {
                          console.log('edit game', sched);
                        },
                        visible: true,
                      },
                      {
                        label: 'Info',
                        icon: faInfo,
                        onClick: () => {
                          console.log('Game info', sched);
                        },
                        visible: true,
                      },
                    ]}
                  />
                </div>
              </FlexContainer>
            </StyledGameContainer>
          </>
        );
      })}
    </FlexContainer>
  );
};

export default TournamentScheduleContainer;
