import { useCallback } from 'react';
import useSound from 'use-sound';
import countdownSound from '../../../assets/sounds/PB_GS_Start2.mp3';
import pointSound from '../../../assets/sounds/test1.mp3';

const useCountdownSound = () => {
  const [play, { stop }] = useSound(countdownSound);
  console.log(pointSound);
  const playCountdown = useCallback(() => {
    play();
  }, [play]);

  const stopCountdown = useCallback(() => {
    stop();
  }, [stop]);

  return { playCountdown, stopCountdown };
};

export default useCountdownSound;
