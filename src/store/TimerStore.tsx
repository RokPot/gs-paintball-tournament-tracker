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
    onFinishCallback?: (hasFinished: boolean) => void,
    onBreakFinishCallback?: (hasFinished: boolean) => void,
    onStartCountdown?: () => void,
  ) => void;
  stopTimer: () => void;
  resetTimer: () => void;
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
    callback,
    onBreakFinishCallback,
    onStartCountdown,
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
        if (state.duration - delayInMs === 0) {
          callback?.(true);
          set({ timingBreak: false, timingGame: false });

          state.stopTimer();
        }
        if (state.breakDuration - delayInMs === 0) {
          onBreakFinishCallback?.(true);
          set({ timingBreak: false, timingGame: true });
        }
        if (state.breakDuration - delayInMs === 5000) {
          onStartCountdown?.();
        }
        localStorage.setItem(
          'gameDuration',
          `${!state.timingBreak ? state.duration - delayInMs : state.duration}`,
        );
        return {
          duration: !state.timingBreak
            ? state.duration - delayInMs
            : state.duration,
          currentDuration: !state.timingBreak
            ? state.currentDuration + delayInMs
            : state.currentDuration,
          breakDuration: state.timingBreak
            ? state.breakDuration - delayInMs
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
    set({
      timerRef: undefined,
      timerFn: undefined,
      timingBreak: false,
      timingGame: false,
    });
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
  resetTimer: () => {
    set(() => ({
      duration: 0,
      currentDuration: 0,
      breakDuration: 0,
      timingBreak: false,
      timingGame: false,
    }));
  },
}));

export default useTimerStore;
