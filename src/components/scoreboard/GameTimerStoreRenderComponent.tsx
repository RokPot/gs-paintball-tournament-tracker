import TimerStoreRenderComponent from './TimerStoreRenderComponent';
import { memo } from 'react';
import useTimerStore from 'store/ScoreboardStore';

const GameTimerStoreRenderComponent: React.FC = () => {
  const { duration } = useTimerStore();
  return <TimerStoreRenderComponent duration={duration} />;
};

export default memo(GameTimerStoreRenderComponent);
