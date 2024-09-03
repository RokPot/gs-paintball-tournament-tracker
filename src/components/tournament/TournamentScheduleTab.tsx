import { useContext } from 'react';
import { TournamentContext } from 'store/TournamentContext';
import ScheduleContainer from './visualizations/schedule/ScheduleContainer';

const TournamentScheduleTab = () => {
  const { activeTournament } = useContext(TournamentContext);
  return <ScheduleContainer activeTournament={activeTournament} />;
};

export default TournamentScheduleTab;
