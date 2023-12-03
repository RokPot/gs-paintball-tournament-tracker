import { Theme, Typography, css, styled } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import Game from 'types/Game';
import BracketsTeamRow from './BracketsTeamRow';

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
    border-radius: 0px 5px 3px 0px;
    border-collapse: collapse;
    /* position: absolute; */
    top: 39px;
    right: 30px;
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
    border-radius: 0px 5px 3px 0px;
    border-collapse: collapse;
    /* position: absolute; */
    top: -10px;
    right: 30px;
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
  title?: string;
  game: Game;
  index: number;
  arrowHeight: number;
}

const BracketsGameRow: React.FC<IProps> = ({ game, index, arrowHeight }) => {
  console.log(arrowHeight);
  return (
    <FlexContainer
      flexDirection="row"
      position="relative"
      padding="0px 00px 0px 0px"
    >
      <FlexContainer flexDirection="column" position="relative">
        {game.bracketProperties?.isThridPlaceGame && (
          <Typography position="absolute" variant="p1" top={-20}>
            Third place
          </Typography>
        )}

        <BracketsTeamRow team={game.team1} teamScore={game.team1Wins} />
        <BracketsTeamRow team={game.team2} teamScore={game.team2Wins} />
      </FlexContainer>
    </FlexContainer>
  );
};

export default BracketsGameRow;
