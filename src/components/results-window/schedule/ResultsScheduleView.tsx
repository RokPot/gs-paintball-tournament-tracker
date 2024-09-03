import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';
import ResultsScheduleContainer from './ResultsScheduleContainer';

interface IProps {
  activeLeague: League | undefined | null;
}

const ResultsScheduleView: React.FC<IProps> = ({ activeLeague }) => {
  if (!activeLeague) {
    return null;
  }
  return (
    <FlexContainer
      width="100%"
      height="100%"
      alignItems="flex-start"
      flexDirection="column"
    >
      <ResultsScheduleContainer
        activeTournament={activeLeague?.activeTournament}
      />
    </FlexContainer>
  );
};

export default ResultsScheduleView;
