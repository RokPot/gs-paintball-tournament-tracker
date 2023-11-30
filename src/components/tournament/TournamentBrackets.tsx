import { Theme, css, styled } from '@mui/material';
import BracketsGameRow from 'components/brackets/BracketsGameRow';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';
import { generateGamesForEliminationBrackets } from 'utils/tournamentUtils';

interface VerticalArrowProps {
  height: number;
}

const StyledArrowUpperVertical = styled('div')(
  (props: VerticalArrowProps & { theme?: Theme }) => css`
    border-top: 2px solid ${props.theme?.palette.primary.light};
    border-right: 2px solid ${props.theme?.palette.primary.light};
    width: 70px;
    margin-top: 0px;
    height: ${props.height}px;
    border-left: none;
    border-radius: 0px 5px 5px 0px;
    border-collapse: collapse;
  `,
);
const StyledArrowLowerVertical = styled('div')(
  (props: VerticalArrowProps & { theme?: Theme }) => css`
    border-bottom: 2px solid ${props.theme?.palette.primary.light};
    border-right: 2px solid ${props.theme?.palette.primary.light};
    width: 70px;
    margin-top: 0px;
    height: ${props.height}px;
    border-left: none;
    border-radius: 0px 5px 5px 0px;
    border-collapse: collapse;
  `,
);

const StyledArrowHorizontal = styled('div')(
  (props) => css`
    border: 1.5px solid ${props.theme.palette.primary.light};
    width: 70px;
    height: 0.5px;
    border-left: none;
    border-radius: 0px 5px 5px 0px;
  `,
);
interface IProps {
  activeLeague: League;
}

const TournamentBrackets = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;
  const teamComponentRowHeight = 40;
  const firstRoundPadding = 40 + Math.ceil(40 / 4);
  const firstRowHeight = 2 * teamComponentRowHeight + 20;
  if (!selectedTournament || !activeLeague) {
    return null;
  }

  const { games, totalNumberOfRounds } = generateGamesForEliminationBrackets(
    [],
  );

  return (
    <FlexContainer
      flexDirection="row"
      alignItems="flex-start"
      padding="20px 0px 0px 0px"
    >
      {[...Array(totalNumberOfRounds)].map((val, index) => {
        const layer = index;
        const layerConstants = [0.5, 3, 8, 18, 31];
        const getContainerMargin = (depth: number) => {
          return layerConstants[depth] * teamComponentRowHeight;
        };
        const getArrowMargin = (depth: number) => {
          return (
            layerConstants[depth] * teamComponentRowHeight +
            2 * teamComponentRowHeight -
            2
          );
        };
        const getContainerPadding = (depth: number) => {
          return depth === 0 ? 0 : (2 ** depth - 1) * firstRoundPadding;
        };
        const getArrowPadding = (depth: number) => {
          if (depth === 0) {
            return teamComponentRowHeight - 1;
          }
          return (
            (2 ** depth - 1) * firstRoundPadding + teamComponentRowHeight - 1
          );
        };

        const getArrowsHeight = (depth: number) => {
          return 2 ** depth * firstRowHeight + 1 * 2;
        };

        return (
          <>
            <FlexContainer
              flexDirection="column"
              margin={getContainerMargin(layer)}
              padding={`${getContainerPadding(layer)}px 0px 0px 0px`}
            >
              {games
                .filter(
                  (game) =>
                    game.bracketProperties?.round === layer &&
                    !game.bracketProperties?.bye,
                )
                .map(
                  (game) => !game.bracketProperties?.bye && <BracketsGameRow />,
                )}
            </FlexContainer>
            <FlexContainer
              flexDirection="column"
              style={{ marginLeft: '-7px', marginRight: '-7px' }}
              margin={getArrowMargin(layer)}
              padding={`${getArrowPadding(layer)}px 0px 0px 0px`}
            >
              {games
                .filter((game) => game.bracketProperties?.round === layer + 1)
                .map((newLayerGame) => {
                  const previousGames = games
                    .filter(
                      (game) =>
                        game.bracketProperties?.round ===
                        (newLayerGame?.bracketProperties?.round || 0) - 1,
                    )
                    .filter(
                      (game) =>
                        (newLayerGame.bracketProperties
                          ?.previousLayerGame1Number ===
                          game?.bracketProperties?.roundGameNumber ||
                          newLayerGame.bracketProperties
                            ?.previousLayerGame2Number ===
                            game?.bracketProperties?.roundGameNumber) &&
                        !game.bracketProperties?.bye,
                    );
                  if (!previousGames || !previousGames.length) {
                    return null;
                  }
                  return (
                    <FlexContainer>
                      <FlexContainer flexDirection="column">
                        <StyledArrowUpperVertical
                          height={Math.floor(getArrowsHeight(layer) / 2)}
                        />
                        <StyledArrowLowerVertical
                          height={Math.ceil(getArrowsHeight(layer) / 2)}
                        />
                      </FlexContainer>
                      <StyledArrowHorizontal />
                    </FlexContainer>
                  );
                })}
            </FlexContainer>
          </>
        );
      })}
    </FlexContainer>
  );
};

export default TournamentBrackets;
