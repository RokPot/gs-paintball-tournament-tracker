import FlexContainer from 'components/shared/FlexContainer';
import BracketsTeamRow from './BracketsTeamRow';

const BracketsGameRow = () => {
  return (
    <FlexContainer flexDirection="column">
      <BracketsTeamRow />
      <BracketsTeamRow />
    </FlexContainer>
  );
};

export default BracketsGameRow;
