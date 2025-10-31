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

  const stopCountdown = useCallback(async () => {
    if (!countdownAudioPlayer) {
      return;
    }
    try {
      await countdownAudioPlayer.pause();
      await countdownAudioPlayer.load();
    } catch (error) {
      console.log('error', error);
    }
  }, [countdownAudioPlayer]);

  const playMatchPoint = useCallback(async () => {
    if (!matchPointAudioPlayer) {
      return;
    }
    try {
      await matchPointAudioPlayer.pause();
      await matchPointAudioPlayer.load();
      await matchPointAudioPlayer.play();
    } catch (error) {
      console.log('error', error);
    }
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
