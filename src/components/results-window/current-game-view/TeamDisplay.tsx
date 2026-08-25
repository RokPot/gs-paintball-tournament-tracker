import { Typography } from '@mui/material';
import { useMemo } from 'react';
import Team from 'types/Team';
import { getDisplayTeamName } from 'utils/tournamentUtils';

interface IProps {
  team: Team;
  fontSize: string;
  align: 'end' | 'start';
}

const TeamDisplay: React.FC<IProps> = ({ team, fontSize, align }) => {
  const teamName = useMemo(() => getDisplayTeamName(team), [team]);
  return (
    <Typography
      variant="h2Medium"
      fontSize={fontSize}
      lineHeight="1em"
      style={{
        width: '50%',
        textAlign: align,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {teamName}
    </Typography>
  );
};
export default TeamDisplay;
