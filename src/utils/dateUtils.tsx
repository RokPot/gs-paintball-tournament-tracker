import dayjs, { Dayjs } from 'dayjs';

export const millisecondsToTime = (durationTime?: number) => {
  if (!durationTime) {
    return {
      formatted: `00:00`,
      milisecondsString: '0',
    };
  }
  const miliseconds = (durationTime % 1000) / 100;
  const seconds = Math.floor((durationTime / 1000) % 60);
  const minutes = Math.floor((durationTime / (1000 * 60)) % 60);

  const minutesString = minutes < 10 ? `0${minutes}` : minutes;
  const secondsString = seconds < 10 ? `0${seconds}` : seconds;
  const milisecondsString = Math.floor(miliseconds);

  return {
    formatted: `${minutesString}:${secondsString}`,
    milisecondsString,
  };
};

export const convertFromSecondsDayjs = (seconds: number) => {
  return dayjs()
    .minute(Math.floor(seconds / 60))
    .second(seconds % 60);
};

export const fromDayjsToSeconds = (time: Dayjs) => {
  return (time.minute() || 1) * (time.second() || 60);
};
