import League from 'types/League';
import ScheduleContainer from './visualizations/schedule/ScheduleContainer';

interface IProps {
  activeLeague: League;
}

const TournamentScheduleTab = ({ activeLeague }: IProps) => {
  return <ScheduleContainer activeLeague={activeLeague} />;
};

export default TournamentScheduleTab;
