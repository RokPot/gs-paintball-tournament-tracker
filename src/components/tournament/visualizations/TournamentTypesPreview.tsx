import Team from 'types/Team';
import { TournamentGroup } from 'types/TournamentGroup';
import { TournamentType } from 'types/TournamentType';
import BracketsPreview from './brackets/BracketsPreview';
import RoundRobinPreview from './round-robin/RoundRobinPreview';

interface IProps {
  group?: TournamentGroup;
  teams?: Team[];
  totalNumberOfRounds?: number;
}

const TournamentTypesPreview: React.FC<IProps> = ({
  group,
  totalNumberOfRounds,
}) => {
  switch (group?.groupType) {
    case TournamentType.roundRobin: {
      return group && <RoundRobinPreview group={group} />;
    }
    case TournamentType.singleElimination: {
      return (
        <BracketsPreview
          games={group.games}
          totalNumberOfRounds={totalNumberOfRounds!}
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
