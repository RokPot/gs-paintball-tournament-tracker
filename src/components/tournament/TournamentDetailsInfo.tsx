import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';

interface IProps {
  title: string;
  value?: string | number;
  date?: Date;
}

const TournamentDetailsInfo: React.FC<IProps> = ({ title, value, date }) => {
  return (
    <FlexContainer padding="8px" width="100%">
      <Typography variant="p2" minWidth="100px">
        {title}:
      </Typography>
      <Typography variant="p2Bold">
        {' '}
        {date && date.toLocaleString()}
        {value}
      </Typography>
    </FlexContainer>
  );
};
export default TournamentDetailsInfo;
