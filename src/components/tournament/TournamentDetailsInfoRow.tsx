import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';

interface IProps {
  title: string;
  value?: string | number;
  date?: Date;
}

const TournamentDetailsInfoRow = ({ title, value, date }: IProps) => {
  return (
    <FlexContainer padding="8px" width="100%">
      <Typography variant="p2" minWidth="100px">
        {title}:
      </Typography>
      <Typography variant="p2Bold" paddingLeft={1}>
        {' '}
        {date && date.toLocaleString()}
        {value}
      </Typography>
    </FlexContainer>
  );
};
export default TournamentDetailsInfoRow;
