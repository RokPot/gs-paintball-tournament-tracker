import { Typography, styled } from '@mui/material';

export const StyledDivider = styled('div')`
  border-bottom: 0.5px solid ${({ theme }) => theme.palette.primary.light};
  width: 100%;
  height: 1px;
`;

interface IProps {
  groupIndex: number;
}

const ScheduleRowGroup: React.FC<IProps> = ({ groupIndex }) => {
  return (
    <Typography
      variant="p1Bold"
      textAlign="start"
      fontSize="clamp(1rem, 3vh, 2.2rem)"
      lineHeight="1em"
      padding="1.2vh 16px 0.6vh 20px"
      color={({ palette }) => palette.text.secondary}
      style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
    >
      Group {groupIndex}
    </Typography>
  );
};

export default ScheduleRowGroup;
