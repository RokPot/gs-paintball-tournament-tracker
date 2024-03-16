import FlexContainer from 'components/shared/FlexContainer';
import ScheduleContainer from 'components/tournament/visualizations/schedule/ScheduleContainer';
import ScheduleUpcomingGames from 'components/tournament/visualizations/schedule/ScheduleUpcomingGames';
import League from 'types/League';

interface IProps {
  activeLeague: League | null;
}

const ScheduleView: React.FC<IProps> = ({ activeLeague }) => {
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
      <ScheduleContainer activeLeague={activeLeague} disableEditting />
      <ScheduleUpcomingGames
        activeLeague={activeLeague}
        style={{
          marginLeft: '0px',
          marginBottom: '0px',
          marginRight: '0px',
          width: '100%',
        }}
      />
    </FlexContainer>
  );
};

export default ScheduleView;
