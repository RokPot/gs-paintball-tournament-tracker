import { Theme, css, styled } from '@mui/material';
import BracketsGameRow from 'components/brackets/BracketsGameRow';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';

const teamRowHeight = 40;
const firstPadding = 40 + Math.ceil(40 / 4);
const firstLevelHeight = 2 * teamRowHeight + 20;
const secondLevelHeight = 100;
interface VerticalArrowProps {
  height: number;
}

const StyledArrowVertical = styled('div')(
  (props: VerticalArrowProps & { theme?: Theme }) => css`
    border: 2px solid ${props.theme?.palette.primary.light};
    width: 60px;
    margin-top: 0px;
    height: ${props.height}px;
    border-left: none;
    border-radius: 0px 5px 5px 0px;
    border-collapse: collapse;
  `,
);
const StyledArrowHorizontal = styled('div')(
  (props) => css`
    border: 1px solid ${props.theme.palette.primary.light};

    width: 60px;

    height: 1px;
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
  const level1 = 2;

  const firstLevelHeightContainer = firstLevelHeight + 1 * 2;

  const secondLevelHeightContainer = 2 * firstLevelHeight + 1 * 2;

  const thirdLevelHeightContainer = 4 * firstLevelHeight + 1 * 2;

  const fourthLevelHeightContainer = 8 * firstLevelHeight + 1 * 2;

  const numberOfTeams = 8;
  let numOfLayers = 0;
  while (numberOfTeams > 2 ** numOfLayers) {
    numOfLayers += 1;
  }
  // 2 ^( n - 1) + 1
  // ali 2 ^ n - 1
  return (
    <FlexContainer
      flexDirection="row"
      alignItems="flex-start"
      padding="20px 0px 0px 0px"
    >
      <FlexContainer
        flexDirection="column"
        margin={Math.floor(teamRowHeight / 2)}
      >
        <BracketsGameRow />
        <BracketsGameRow />
        <BracketsGameRow />
        <BracketsGameRow />
        <BracketsGameRow />
        <BracketsGameRow />
        <BracketsGameRow />
        <BracketsGameRow />
      </FlexContainer>
      <FlexContainer
        flexDirection="column"
        style={{ marginLeft: '-5px', marginRight: '-5px' }}
        margin={Math.floor(teamRowHeight / 2)}
      >
        <FlexContainer style={{ paddingTop: `${teamRowHeight - 1}px` }}>
          <StyledArrowVertical height={firstLevelHeightContainer} />
          <StyledArrowHorizontal />
        </FlexContainer>
        <FlexContainer
          style={{ paddingTop: `${level1 * teamRowHeight - 2}px` }}
        >
          <StyledArrowVertical height={firstLevelHeightContainer} />
          <StyledArrowHorizontal />
        </FlexContainer>
        <FlexContainer
          style={{ paddingTop: `${level1 * teamRowHeight - 2}px` }}
        >
          <StyledArrowVertical height={firstLevelHeightContainer} />
          <StyledArrowHorizontal />
        </FlexContainer>
        <FlexContainer
          style={{ paddingTop: `${level1 * teamRowHeight - 2}px` }}
        >
          <StyledArrowVertical height={firstLevelHeightContainer} />
          <StyledArrowHorizontal />
        </FlexContainer>
      </FlexContainer>

      <FlexContainer
        flexDirection="column"
        margin={teamRowHeight * 3}
        padding={`${firstPadding}px 0px 0px 0px`}
      >
        <BracketsGameRow />
        <BracketsGameRow />
        <BracketsGameRow />
        <BracketsGameRow />
      </FlexContainer>
      <FlexContainer
        flexDirection="column"
        style={{ marginLeft: '-5px', marginRight: '-5px' }}
        margin={teamRowHeight * 3}
      >
        <FlexContainer
          style={{ paddingTop: `${teamRowHeight - 1 + firstPadding}px` }}
        >
          <StyledArrowVertical height={secondLevelHeightContainer} />
          <StyledArrowHorizontal />
        </FlexContainer>
        <FlexContainer
          style={{
            paddingTop: `${teamRowHeight * 2 - 2}px`,
          }}
        >
          <StyledArrowVertical height={secondLevelHeightContainer} />
          <StyledArrowHorizontal />
        </FlexContainer>
      </FlexContainer>
      <FlexContainer
        flexDirection="column"
        margin={teamRowHeight * 8}
        padding={`${3 * firstPadding}px 0px 0px 0px`}
      >
        <BracketsGameRow />
        <BracketsGameRow />
      </FlexContainer>
      <FlexContainer
        flexDirection="column"
        style={{ marginLeft: '-5px', marginRight: '-5px' }}
        margin={teamRowHeight * 8}
      >
        <FlexContainer
          style={{
            paddingTop: `${1 * teamRowHeight - 1 + 3 * firstPadding}px`,
          }}
        >
          <StyledArrowVertical height={thirdLevelHeightContainer} />
          <StyledArrowHorizontal />
        </FlexContainer>
      </FlexContainer>
      <FlexContainer
        flexDirection="column"
        margin={teamRowHeight * 18}
        padding={`${7 * firstPadding}px 0px 0px 0px`}
      >
        <BracketsGameRow />
      </FlexContainer>
    </FlexContainer>
  );
};

export default TournamentBrackets;
