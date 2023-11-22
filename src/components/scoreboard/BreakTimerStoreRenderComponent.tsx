import { memo } from 'react';
import useTimerStore from 'store/TimerStore';
import TimerStoreRenderComponent from './TimerStoreRenderComponent';

const BreakTimerStoreRenderComponent: React.FC = () => {
  const { duration } = useTimerStore();

  return <TimerStoreRenderComponent duration={duration} />;
};

export default memo(BreakTimerStoreRenderComponent);
