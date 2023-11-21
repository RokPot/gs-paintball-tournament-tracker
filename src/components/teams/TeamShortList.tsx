import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, IconButton, Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { Team } from 'types/Team';

interface IProps {
  teams?: Team[];
  className?: string;
  showRemoveButton?: boolean;
  showEditButton?: boolean;
  onEditTeam?: (team: Team, index: number) => void;
  onRemoveTeam?: (team: Team, index: number) => void;
}

const TeamsShortList: React.FC<IProps> = ({
  teams,
  showRemoveButton,
  showEditButton,
  className,
  onRemoveTeam,
}) => {
  return (
    <FlexContainer width="100%" flexDirection="column">
      {teams?.map((team: Team, index: number) => (
        <FlexContainer
          flexDirection="row"
          margin={8}
          padding="8px"
          key={index}
          width="100%"
          highlightRowOnHover
        >
          <Typography variant="p1Medium">{index + 1}.</Typography>
          <Avatar variant="rounded" style={{ backgroundColor: team.color }}>
            <Typography
              variant="p1Medium"
              style={{ textTransform: 'uppercase' }}
            >
              {team?.teamTag}
            </Typography>
          </Avatar>
          <Typography>{team?.teamName}</Typography>
          <Typography
            variant="subtitle1"
            color={(theme) => theme.palette.text.secondary}
          >
            {team?.members?.length
              ? `(${team?.members.length} ${
                  team?.members.length === 1 ? 'member' : 'members'
                })`
              : ''}
          </Typography>
          {showRemoveButton && (
            <IconButton
              style={{ width: '20px', height: '20px', marginLeft: 'auto' }}
              onClick={() => onRemoveTeam?.(team, index)}
            >
              <FontAwesomeIcon icon={faRemove} width={10} />
            </IconButton>
          )}
        </FlexContainer>
      ))}
    </FlexContainer>
  );
};

export default TeamsShortList;
