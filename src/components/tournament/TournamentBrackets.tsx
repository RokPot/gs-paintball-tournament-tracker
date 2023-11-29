import { Theme, css, styled } from '@mui/material';
import BracketsGameRow from 'components/brackets/BracketsGameRow';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';

const teamRowHeight = 40;
const firstPadding = 40 + Math.ceil(40 / 4);
const firstLevelHeight = 2 * teamRowHeight + 20;
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

  if (!selectedTournament || !activeLeague) {
    return null;
  }
  const numberOfGames = 16;
  let numOfLayers = 0;
  while (numberOfGames > 2 ** numOfLayers) {
    numOfLayers += 1;
  }
  numOfLayers += 1;

  const test = [
    {
      layer: 0,
      layerGameNumber: 1,
      nextLayerGameNumber: 1,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 2,
      nextLayerGameNumber: 1,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 3,
      nextLayerGameNumber: 2,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 4,
      nextLayerGameNumber: 2,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 5,
      nextLayerGameNumber: 3,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 6,
      nextLayerGameNumber: 3,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 7,
      nextLayerGameNumber: 4,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 8,
      nextLayerGameNumber: 4,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 9,
      nextLayerGameNumber: 5,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 10,
      nextLayerGameNumber: 5,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 11,
      nextLayerGameNumber: 6,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 12,
      nextLayerGameNumber: 6,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 13,
      nextLayerGameNumber: 7,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      layerGameNumber: 14,
      nextLayerGameNumber: 7,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      bye: true,
      layerGameNumber: 15,
      nextLayerGameNumber: 8,
      previousLayerGamesNumber: null,
    },
    {
      layer: 0,
      bye: true,
      layerGameNumber: 16,
      nextLayerGameNumber: 8,
      previousLayerGamesNumber: null,
    },
    {
      layer: 1,
      bye: false,
      layerGameNumber: 1,
      nextLayerGameNumber: 8,
      previousLayerGamesNumber: [1, 2],
    },
    {
      layer: 1,
      bye: false,
      layerGameNumber: 2,
      nextLayerGameNumber: 8,
      previousLayerGamesNumber: [3, 4],
    },
    {
      layer: 1,
      bye: true,
      layerGameNumber: 3,
      nextLayerGameNumber: 8,
      previousLayerGamesNumber: [5, 6],
    },
    {
      layer: 1,
      bye: true,
      layerGameNumber: 4,
      nextLayerGameNumber: 8,
      previousLayerGamesNumber: [7, 8],
    },
    {
      layer: 1,
      bye: true,
      layerGameNumber: 5,
      nextLayerGameNumber: 8,
      previousLayerGamesNumber: [9, 10],
    },
    {
      layer: 1,
      bye: true,
      layerGameNumber: 6,
      nextLayerGameNumber: 8,
      previousLayerGamesNumber: [11, 12],
    },
    {
      layer: 1,
      bye: true,
      layerGameNumber: 7,
      nextLayerGameNumber: 8,
      previousLayerGamesNumber: [13, 14],
    },
    {
      layer: 1,
      bye: true,
      layerGameNumber: 8,
      nextLayerGameNumber: 8,
      previousLayerGamesNumber: [15, 16],
    },
    {
      layer: 2,
    },
    {
      layer: 2,
    },
    {
      layer: 2,
    },
    {
      layer: 2,
    },
    {
      layer: 3,
    },
    {
      layer: 3,
    },
    {
      layer: 4,
    },
  ];
  return (
    <FlexContainer
      flexDirection="row"
      alignItems="flex-start"
      padding="20px 0px 0px 0px"
    >
      {[...Array(numOfLayers)].map((val, index) => {
        const layer = index;
        const layerConstants = [0.5, 3, 8, 18];
        const getContainerMargin = (depth: number) => {
          return layerConstants[depth] * teamRowHeight;
        };
        const getArrowMargin = (depth: number) => {
          return layerConstants[depth] * teamRowHeight + 2 * teamRowHeight - 2;
        };
        const getContainerPadding = (depth: number) => {
          return depth === 0 ? 0 : (2 ** depth - 1) * firstPadding;
        };
        const getArrowPadding = (depth: number) => {
          if (depth === 0) {
            return teamRowHeight - 1;
          }
          return (2 ** depth - 1) * firstPadding + teamRowHeight - 1;
        };

        const getArrowsHeight = (depth: number) => {
          return 2 ** depth * firstLevelHeight + 1 * 2;
        };

        return (
          <>
            <FlexContainer
              flexDirection="column"
              margin={getContainerMargin(layer)}
              padding={`${getContainerPadding(layer)}px 0px 0px 0px`}
            >
              {test
                .filter((obj) => obj.layer === layer)
                .map((_) => (
                  <BracketsGameRow />
                ))}
            </FlexContainer>
            <FlexContainer
              flexDirection="column"
              style={{ marginLeft: '-7px', marginRight: '-7px' }}
              margin={getArrowMargin(layer)}
              padding={`${getArrowPadding(layer)}px 0px 0px 0px`}
            >
              {test
                .filter((obj) => obj.layer === layer + 1)
                .map((layerdata) => (
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
                ))}
            </FlexContainer>
          </>
        );
      })}
    </FlexContainer>
  );
};

export default TournamentBrackets;
