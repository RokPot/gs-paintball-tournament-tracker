import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';
import ResultsScheduleContainer from './ResultsScheduleContainer';

interface IProps {
  activeLeague: League | undefined | null;
  hideFinishedGames?: boolean;
  activeGameId?: string;
}

const ResultsScheduleView: React.FC<IProps> = ({
  activeLeague,
  hideFinishedGames,
  activeGameId,
}) => {
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
        hideFinishedGames={hideFinishedGames}
        activeGameId={activeGameId}
      />
    </FlexContainer>
  );
};

export default ResultsScheduleView;
