import FlexContainer from 'components/shared/FlexContainer';
import ScheduleContainer from 'components/tournament/visualizations/schedule/ScheduleContainer';
import League from 'types/League';

interface IProps {
  activeLeague?: League;
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
      <ScheduleContainer
        activeLeague={activeLeague}
        disableEditting
        disableNewWindowOpen
      />
    </FlexContainer>
  );
};

export default ScheduleView;
