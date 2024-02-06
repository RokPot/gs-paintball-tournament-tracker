import { useCallback, useEffect, useMemo, useState } from 'react';
import countdownSound from '../../../assets/sounds/PB_GS_Start2.mp3';
import pointSound from '../../../assets/sounds/test1.mp3';

const useCountdownSound = () => {
  const [countdownAudioPlayer, setCountdownAudioPlayer] =
    useState<HTMLAudioElement>();
  const [matchPointAudioPlayer, setMatchPointAudioPlayer] =
    useState<HTMLAudioElement>();

  const playCountdown = useCallback(() => {
    if (!countdownAudioPlayer) {
      return;
    }
    countdownAudioPlayer.pause();
    countdownAudioPlayer.load();
    countdownAudioPlayer.play();
  }, [countdownAudioPlayer]);

  const stopCountdown = useCallback(() => {
    if (!countdownAudioPlayer) {
      return;
    }
    countdownAudioPlayer.load();
    countdownAudioPlayer.pause();
  }, [countdownAudioPlayer]);

  const playMatchPoint = useCallback(() => {
    if (!matchPointAudioPlayer) {
      return;
    }
    matchPointAudioPlayer.pause();
    matchPointAudioPlayer.load();
    matchPointAudioPlayer.play();
  }, [matchPointAudioPlayer]);

  const stopMatchPoint = useCallback(() => {
    if (!matchPointAudioPlayer) {
      return;
    }
    matchPointAudioPlayer.pause();
    matchPointAudioPlayer.load();
  }, [matchPointAudioPlayer]);

  useEffect(() => {
    setCountdownAudioPlayer(new Audio(countdownSound));
    setMatchPointAudioPlayer(new Audio(pointSound));
  }, []);
  return useMemo(() => {
    return { playCountdown, stopCountdown, stopMatchPoint, playMatchPoint };
  }, [playCountdown, playMatchPoint, stopCountdown, stopMatchPoint]);
};

export default useCountdownSound;
