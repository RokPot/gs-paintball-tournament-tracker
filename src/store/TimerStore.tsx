import { clearInterval, setInterval } from 'worker-timers';
import { create } from 'zustand';

interface TimerStoreState {
  timerRef?: number;
  timerFn?: Function;
  duration: number;
  currentDuration: number;
  breakDuration: number;
  timingBreak: boolean;
  timingGame: boolean;
  setTimerRef: (timer: number) => void;
  setDuration: (duration: number) => void;
  setBreakDuration: (breakDuration: number) => void;
  getDuration: () => { duration: number; currentDuration: number };
  startTimer: (
    delayInMs: number,
    duration: number,
    breakDuration: number,
    useAddition?: boolean,
    onFinishCallback?: (hasFinished: boolean) => void,
    onBreakFinishCallback?: (hasFinished: boolean) => void,
  ) => void;
  stopTimer: () => void;
}

const useTimerStore = create<TimerStoreState>((set, get) => ({
  duration: 0,
  currentDuration: 0,
  breakDuration: 0,
  timingBreak: false,
  timingGame: false,
  startTimer: (
    delayInMs,
    duration,
    breakDuration,
    useAddition,
    callback,
    onBreakFinishCallback,
  ) => {
    set(() => ({
      timerFn: callback,
      duration,
      currentDuration: 0,
      breakDuration,
      timingBreak: true,
      timingGame: false,
    }));
    const timer = get().timerRef;
    if (timer) {
      clearInterval(timer);
    }

    const interval = setInterval(() => {
      set((state) => {
        if (state.duration + delayInMs * (useAddition ? 1 : -1) === 0) {
          callback?.(true);
          set({ timingBreak: false, timingGame: false });

          state.stopTimer();
        }
        if (state.breakDuration + delayInMs * (useAddition ? 1 : -1) === 0) {
          onBreakFinishCallback?.(true);
          set({ timingBreak: false, timingGame: true });
        }
        return {
          duration: !state.timingBreak
            ? state.duration + delayInMs * (useAddition ? 1 : -1)
            : state.duration,
          currentDuration: state.currentDuration + delayInMs,
          breakDuration: state.timingBreak
            ? state.breakDuration + delayInMs * (useAddition ? 1 : -1)
            : state.breakDuration,
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
    set({ timerRef: undefined, timerFn: undefined });
  },
  setTimerRef: (timer) => {
    set(() => ({ timerRef: timer }));
  },
  setDuration: (duration) => {
    set(() => ({ duration }));
  },
  setBreakDuration: (breakDuration) => {
    set(() => ({ breakDuration }));
  },
  getDuration: () => {
    return { duration: get().duration, currentDuration: get().currentDuration };
  },
}));

export default useTimerStore;
