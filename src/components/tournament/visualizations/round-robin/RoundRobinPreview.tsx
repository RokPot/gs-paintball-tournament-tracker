import TournamentGroup from 'types/TournamentGroup';
import RoundRobinContainer from './RoundRobinContainer';

interface IProps {
  group: TournamentGroup;
}

const RoundRobinPreview: React.FC<IProps> = ({ group }) => {
  return <RoundRobinContainer group={group} hideTeamLeaderboard hideTitle />;
};

export default RoundRobinPreview;
