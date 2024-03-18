import { Typography } from '@mui/material';
import { memo } from 'react';
import { millisecondsToTime } from 'utils/dateUtils';

interface IProps {
  duration: number;
}

const TimerStoreRenderComponent: React.FC<IProps> = ({ duration }) => {
  const formattedDuration = millisecondsToTime(duration);
  return (
    <Typography
      variant="h3Medium"
      fontSize={150}
      lineHeight="normal"
      variantMapping={{ h3Medium: 'span' }}
    >
      {formattedDuration.formatted}
      <Typography
        variant="h6Medium"
        fontSize={60}
        display="inline-block"
        color={(theme) => theme.palette.text.disabled}
        variantMapping={{ h6Medium: 'span' }}
      >
        .{formattedDuration.milisecondsString}
      </Typography>
    </Typography>
  );
};

export default memo(TimerStoreRenderComponent);
