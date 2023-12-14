import { Theme, Typography, css, styled } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import Game from 'types/Game';
import { getGamePairs } from 'utils/tournamentUtils';
import BracketsGameRow from './BracketsGameRow';

interface ArrowProps {
  height?: number;
  width?: number;
}

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
}

const BracketsRoundColumn: React.FC<IProps> = ({
  isLastRound,
  round,
  currentRoundGames,
}) => {
  const teamComponentRowHeight = 40;
  const firstRoundPadding = 40 + Math.ceil(40 / 4);

  const pairedCurrentRoundGames = getGamePairs(currentRoundGames);

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

  const getContainerPadding = (depth: number) => {
    return depth === 0 ? 0 : (2 ** depth - 1) * firstRoundPadding;
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
          {pairedCurrentRoundGames.map((games) => {
            const isGame1Bye = games[0]?.bracketProperties?.bye === true;
            const isGame2Bye = games[1]?.bracketProperties?.bye === true;

            return (
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
                  justifyContent="center"
                >
                  {!isGame1Bye && <BracketsGameRow game={games[0]} />}
                  {!isGame2Bye && <BracketsGameRow game={games[1]} />}
                </FlexContainer>
                {!isLastRound && (
                  <>
                    {!isGame1Bye && !isGame2Bye && (
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
                    {(isGame1Bye || isGame2Bye) &&
                      !(isGame1Bye && isGame2Bye) && (
                        <FlexContainer
                          style={{ width: '140px', marginLeft: '-5px' }}
                        >
                          <StyledArrowHorizontal width={140} />
                        </FlexContainer>
                      )}
                  </>
                )}
              </FlexContainer>
            );
          })}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default BracketsRoundColumn;
