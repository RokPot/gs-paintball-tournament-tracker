import { Theme, Typography, css, styled } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import Game from 'types/Game';
import BracketsGameRow from './BracketsGameRow';

interface ArrowProps {
  height?: number;
  width?: number;
}

const StyledArrowUpperVertical = styled('div')(
  (props: ArrowProps & { theme?: Theme }) => css`
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
  (props: ArrowProps & { theme?: Theme }) => css`
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

const StyledArrowPairVertical = styled('div')(
  (props: ArrowProps & { theme?: Theme }) => css`
    border-top: 2px solid ${props.theme?.palette.primary.light};
    border-bottom: 2px solid ${props.theme?.palette.primary.light};
    border-right: 2px solid ${props.theme?.palette.primary.light};
    width: ${props.width ?? 70}px;
    margin-top: 0px;
    border-left: none;
    border-radius: 0px 5px 5px 0px;
    border-collapse: collapse;
    /* height: 0.5px !important; */
  `,
);

const StyledArrowHorizontal = styled('div')(
  (props: ArrowProps & { theme?: Theme }) => css`
    border: 1.5px solid ${props.theme?.palette.primary.light};
    width: ${props.width ?? 70}px;

    height: 0.5px;
    border-left: none;
    border-radius: 0px 5px 5px 0px;
  `,
);

interface IProps {
  isLastRound: boolean;
  round: number;
  currentRoundGames: Game[];
  nextRoundGames?: Game[];
}

const BracketsRoundColumn: React.FC<IProps> = ({
  isLastRound,
  round,
  currentRoundGames,
  nextRoundGames,
}) => {
  const teamComponentRowHeight = 40;
  const firstRoundPadding = 40 + Math.ceil(40 / 4);
  const firstRowHeight = 2 * teamComponentRowHeight + 20;
  const pairedCurrentRoundGames: Game[][] = [];
  let newPair: Game[] = [];
  for (let i = 0; i < currentRoundGames.length; i += 1) {
    if (newPair.length >= 2) {
      pairedCurrentRoundGames.push(newPair);
      newPair = [];
    }
    if (i === 2) {
      currentRoundGames[i].bracketProperties!.bye = true;
    }
    newPair.push(currentRoundGames[i]);
  }
  if (newPair.length > 0) {
    pairedCurrentRoundGames.push(newPair);
  }
  const getContainerMargin = (depth: number): number => {
    if (isLastRound) {
      return teamComponentRowHeight;
    }
    if (depth === 0) {
      return teamComponentRowHeight / 2;
    }
    const depthSquare = 2 ** depth;
    const depthSquareMinusOne = depthSquare - 1;
    const singleGameRowHeight =
      2 * teamComponentRowHeight + teamComponentRowHeight / 2;

    return (
      depthSquareMinusOne * singleGameRowHeight + teamComponentRowHeight / 2
    );
  };
  const getArrowMargin = (depth: number) => {
    const containerMargin = getContainerMargin(depth);

    return containerMargin + 2 * teamComponentRowHeight - 2;
  };
  const getContainerPadding = (depth: number) => {
    return depth === 0 ? 0 : (2 ** depth - 1) * firstRoundPadding;
  };
  const getArrowPadding = (depth: number) => {
    if (depth === 0) {
      return teamComponentRowHeight - 1;
    }
    return (2 ** depth - 1) * firstRoundPadding + teamComponentRowHeight - 1;
  };

  const getArrowsHeight = (depth: number) => {
    return 2 ** depth * firstRowHeight + 1 * 2;
  };
  return (
    <FlexContainer
      flexDirection="column"
      alignItems="flex-start"
      padding="0px 0px 0px 8px"
    >
      <Typography padding="0px 0px 8px 50px" variant="h3">
        Round {round + 1}
      </Typography>
      <FlexContainer flexDirection="row" alignItems="flex-start">
        <FlexContainer
          flexDirection="column"
          padding={`${getContainerPadding(round)}px 0px 0px 0px`}
        >
          {pairedCurrentRoundGames.map((games, index) => (
            <FlexContainer
              flexDirection="row"
              style={{
                marginBottom: getContainerMargin(round),
                marginLeft: '-15px',
              }}
              flex="auto"
              alignItems="stretch"
            >
              <FlexContainer
                flexDirection="column"
                margin={getContainerMargin(round)}
                height={`${getContainerMargin(round) + 160}px`}
              >
                <div style={{ height: '80px' }}>
                  {!games[0]?.bracketProperties?.bye && (
                    <BracketsGameRow
                      game={games[0]}
                      index={index}
                      arrowHeight={Math.floor(getArrowsHeight(round) / 2)}
                    />
                  )}
                </div>
                <div style={{ height: '80px' }}>
                  {!games[1]?.bracketProperties?.bye && (
                    <BracketsGameRow
                      game={games[1]}
                      index={index}
                      arrowHeight={Math.floor(getArrowsHeight(round) / 2)}
                    />
                  )}
                </div>
              </FlexContainer>
              {!isLastRound && (
                <>
                  {!games[1]?.bracketProperties?.bye &&
                    !games[0].bracketProperties?.bye && (
                      <>
                        <StyledArrowPairVertical
                          style={{
                            width: '70px',
                            marginBottom: '39px',
                            marginTop: '39px',
                            marginLeft: '-5px',
                          }}
                        />
                        <FlexContainer>
                          <StyledArrowHorizontal />
                        </FlexContainer>
                      </>
                    )}
                  {games[1]?.bracketProperties?.bye ||
                    (games[0].bracketProperties?.bye && (
                      <FlexContainer style={{ width: '140px' }}>
                        <StyledArrowHorizontal width={140} />
                      </FlexContainer>
                    ))}
                </>
              )}
            </FlexContainer>
          ))}
        </FlexContainer>
        {/* <FlexContainer
          flexDirection="column"
          style={{ marginLeft: '-7px', marginRight: '-14px' }}
          margin={getArrowMargin(round)}
          padding={`${getArrowPadding(round)}px 0px 0px 0px`}
        >
          {nextRoundGames?.map((newLayerGame) => {
            const previousGames = currentRoundGames?.filter(
              (game) =>
                (newLayerGame.bracketProperties?.previousLayerGame1Number ===
                  game?.bracketProperties?.roundGameNumber ||
                  newLayerGame.bracketProperties?.previousLayerGame2Number ===
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
                    height={Math.floor(getArrowsHeight(round) / 2)}
                  />
                  <StyledArrowLowerVertical
                    height={Math.ceil(getArrowsHeight(round) / 2)}
                  />
                </FlexContainer>
                <StyledArrowHorizontal />
              </FlexContainer>
            );
          })}
        </FlexContainer> */}
      </FlexContainer>
    </FlexContainer>
  );
};

export default BracketsRoundColumn;
