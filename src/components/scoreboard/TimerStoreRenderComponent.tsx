import { Typography } from '@mui/material';
import { memo } from 'react';

interface IProps {
  duration: number;
}

const TimerStoreRenderComponent: React.FC<IProps> = ({ duration }) => {
  const milisecondsToTime = (duration: number) => {
    var miliseconds = (duration % 1000) / 10,
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60);

    const minutesString = minutes < 10 ? '0' + minutes : minutes;
    const secondsString = seconds < 10 ? '0' + seconds : seconds;
    const milisecondsString =
      miliseconds < 10 ? '0' + miliseconds : miliseconds;

    return {
      formatted: minutesString + ':' + secondsString,
      milisecondsString,
    };
  };
  const formattedDuration = milisecondsToTime(duration);
  return (
    <Typography variant="h3Medium" fontSize={150} lineHeight="normal">
      {formattedDuration.formatted}
      <Typography
        variant="h6Medium"
        fontSize={60}
        display="inline-block"
        color={(theme) => theme.palette.text.disabled}
      >
        .{formattedDuration.milisecondsString}
      </Typography>
    </Typography>
  );
};

export default memo(TimerStoreRenderComponent);
