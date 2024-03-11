import FlexContainer from 'components/shared/FlexContainer';
import ScheduleContainer from 'components/tournament/visualizations/schedule/ScheduleContainer';
import useActiveLeague from 'services/queries/league/useActiveLeague';

interface IProps {}

const ScheduleView: React.FC<IProps> = () => {
  const { activeLeague } = useActiveLeague();
  if (!activeLeague) {
    return null;
  }
  return (
    <FlexContainer width="100%" height="100%" alignItems="flex-start">
      <ScheduleContainer activeLeague={activeLeague} disableEditting />
    </FlexContainer>
  );
};

export default ScheduleView;
