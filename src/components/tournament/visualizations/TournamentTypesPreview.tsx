import Team from 'types/Team';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentType } from 'types/TournamentType';
import BracketsPreview from './brackets/BracketsPreview';
import RoundRobinPreview from './round-robin/RoundRobinPreview';

interface IProps {
  group?: TournamentGroup;
  teams?: Team[];
}

const TournamentTypesPreview: React.FC<IProps> = ({ group }) => {
  switch (group?.groupType) {
    case TournamentType.roundRobin: {
      return group && <RoundRobinPreview group={group} />;
    }
    case TournamentType.singleElimination: {
      return (
        <BracketsPreview
          games={group.games}
          totalNumberOfRounds={group.settings?.bracketNumberOfRounds || 1}
        />
      );
    }
    case TournamentType.doubleElimination: {
      return <div>Double elimination brackets</div>;
    }
    case TournamentType.training: {
      return <div>This is training, what do you want</div>;
    }
    default: {
      return null;
    }
  }
};

export default TournamentTypesPreview;
