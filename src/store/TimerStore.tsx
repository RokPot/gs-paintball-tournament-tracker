import { clearInterval, setInterval } from 'worker-timers';
import { create } from 'zustand';

interface TimerStoreState {
  timerRef?: number;
  timerFn?: Function;
  duration: number;
  currentDuration: number;
  setTimerRef: (timer: number) => void;
  setDuration: (duration: number) => void;
  getDuration: () => { duration: number; currentDuration: number };
  startTimer: (
    delayInMs: number,
    duration: number,
    useAddition?: boolean,
    onFinishCallback?: (hasFinished: boolean) => void,
  ) => void;
  stopTimer: () => void;
}

const useTimerStore = create<TimerStoreState>((set, get) => ({
  duration: 0,
  currentDuration: 0,
  startTimer: (delayInMs, duration, useAddition, callback) => {
    set(() => ({ timerFn: callback, duration, currentDuration: 0 }));
    const interval = setInterval(() => {
      set((state) => {
        if (state.duration + delayInMs * (useAddition ? 1 : -1) === 0) {
          callback?.(true);
          state.stopTimer();
        }
        return {
          duration: state.duration + delayInMs * (useAddition ? 1 : -1),
          currentDuration: state.currentDuration + delayInMs,
        };
      });
    }, delayInMs);
    set(() => ({ timerRef: interval }));
  },
  stopTimer: () => {
    const timer = get().timerRef;
    if (!timer) {
      return;
    }
    clearInterval(timer);
  },
  setTimerRef: (timer) => {
    set(() => ({ timerRef: timer }));
  },
  setDuration: (duration) => {
    set(() => ({ duration }));
  },
  getDuration: () => {
    return { duration: get().duration, currentDuration: get().currentDuration };
  },
}));

export default useTimerStore;
