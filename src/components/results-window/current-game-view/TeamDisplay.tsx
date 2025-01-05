import { Typography } from '@mui/material';
import { useMemo } from 'react';
import Team from 'types/Team';

interface IProps {
  team: Team;
  fontSize: string;
  align: 'end' | 'start';
}

const TeamDisplay: React.FC<IProps> = ({ team, fontSize, align }) => {
  const teamName = useMemo(() => {
    if (team?.teamName?.length > 10) {
      return team.teamTag;
    }
    return team.teamName;
  }, [team.teamName, team.teamTag]);
  return (
    <Typography
      variant="h2Medium"
      fontSize={fontSize}
      style={{ width: '50%', textAlign: align }}
    >
      {teamName}
    </Typography>
  );
};
export default TeamDisplay;
