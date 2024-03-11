import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';
import ScheduleContainer from './visualizations/schedule/ScheduleContainer';
import ScheduleUpcomingGames from './visualizations/schedule/ScheduleUpcomingGames';

interface IProps {
  activeLeague: League;
}

const TournamentScheduleContainer = ({ activeLeague }: IProps) => {
  return (
    <FlexContainer height="100%" width="100%" flexDirection="column">
      <ScheduleContainer activeLeague={activeLeague} />
      <ScheduleUpcomingGames activeLeague={activeLeague} />
    </FlexContainer>
  );
};

export default TournamentScheduleContainer;
