import { memo } from 'react';
import useTimerStore from 'store/TimerStore';
import TimerStoreRenderComponent from './TimerStoreRenderComponent';

const BreakTimerStoreRenderComponent: React.FC = () => {
  const { breakDuration } = useTimerStore();

  return <TimerStoreRenderComponent duration={breakDuration} />;
};

export default memo(BreakTimerStoreRenderComponent);
