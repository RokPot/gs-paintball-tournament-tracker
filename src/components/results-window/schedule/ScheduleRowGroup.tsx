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
    <Typography variant="p1Medium" textAlign="start" fontSize={25}>
      Group {groupIndex}
    </Typography>
  );
};

export default ScheduleRowGroup;
