import { clearInterval, setInterval } from 'worker-timers';
import { create } from 'zustand';

interface TimerStoreState {
  timerRef?: number;
  timerFn?: Function;
  duration: number;
  setTimerRef: (timer: number) => void;
  setDuration: (duration: number) => void;
  startTimer: (
    delayInMs: number,
    duration: number,
    useAddition?: boolean,
    timerFn?: Function,
  ) => void;
  stopTimer: () => void;
}

const useTimerStore = create<TimerStoreState>((set, get) => ({
  duration: 0,
  startTimer: (delayInMs, duration, useAddition, callback) => {
    set(() => ({ timerFn: callback, duration }));
    const interval = setInterval(() => {
      callback?.();
      set((state) => ({
        duration: state.duration + delayInMs * (useAddition ? 1 : -1),
      }));
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
}));

export default useTimerStore;
