import Team from 'types/Team';
import { TournamentGroup } from 'types/TournamentGroup';
import { TournamentType } from 'types/TournamentType';
import BracketsPreview from './brackets/BracketsPreview';
import RoundRobinPreview from './round-robin/RoundRobinPreview';

interface IProps {
  tournamentType: TournamentType;
  group?: TournamentGroup;
  teams?: Team[];
}

const TournamentTypesPreview: React.FC<IProps> = ({
  tournamentType,
  group,
  teams,
}) => {
  console.log(tournamentType, teams);
  switch (tournamentType) {
    case TournamentType.roundRobin: {
      return group && <RoundRobinPreview group={group} />;
    }
    case TournamentType.singleElimination: {
      return <div>This is training, what do you want</div>;
    }
    case TournamentType.doubleElimination: {
      return <BracketsPreview />;
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
