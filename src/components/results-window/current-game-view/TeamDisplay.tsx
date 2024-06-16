import { Typography } from '@mui/material';
import Team from 'types/Team';

interface IProps {
  team: Team;
}

const TeamDisplay: React.FC<IProps> = ({ team }) => {
  const fontSize = 80;

  return (
    <Typography variant="h2Medium" fontSize={fontSize}>
      {team.teamName}
    </Typography>
  );
};
export default TeamDisplay;
