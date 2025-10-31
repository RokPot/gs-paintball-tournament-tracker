import { Typography } from '@mui/material';
import VersusIcon from 'components/shared/VersusIcon';
import Team from 'types/Team';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentTypeEnum } from 'types/TournamentType';
import BracketsPreview from './brackets/BracketsPreview';
import RoundRobinPreview from './round-robin/RoundRobinPreview';

interface IProps {
  group?: TournamentGroup;
  teams?: Team[];
}

const TournamentTypesPreview: React.FC<IProps> = ({ group }) => {
  switch (group?.groupType.type) {
    case TournamentTypeEnum.roundRobin: {
      return group && <RoundRobinPreview group={group} />;
    }
    case TournamentTypeEnum.singleElimination: {
      return (
        <BracketsPreview
          games={group.games}
          totalNumberOfRounds={group.settings?.bracketNumberOfRounds || 1}
        />
      );
    }
    case TournamentTypeEnum.renting: {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            justifyContent: 'center',
          }}
        >
          <Typography variant="p1Medium">
            {group?.games[0].team1.teamName}
          </Typography>
          <VersusIcon size={40} />
          <Typography variant="p1Medium">
            {group?.games[0].team2.teamName}
          </Typography>
        </div>
      );
    }

    case TournamentTypeEnum.training: {
      return <div>Training</div>;
    }
    default: {
      return null;
    }
  }
};

export default TournamentTypesPreview;
