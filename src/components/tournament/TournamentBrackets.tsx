import { Typography, css, styled } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';

const StyledTeamNameContainer = styled('div')(
  (props) => css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1.5px solid ${props.theme.palette.primary.main};
    padding: 4px;
    border-radius: 5px 0px 0px 5px;
  `,
);

interface IProps {
  activeLeague: League;
}

const TournamentBrackets = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;

  if (!selectedTournament || !activeLeague) {
    return null;
  }

  return (
    <FlexContainer flexDirection="column">
      <FlexContainer flexDirection="row">
        <StyledTeamNameContainer>
          <Typography variant="p1">Team 1 asd</Typography>
        </StyledTeamNameContainer>
        <div>
          <Typography variant="p1Medium">1</Typography>
        </div>
      </FlexContainer>
      <div> second </div>
      <div> third</div>
    </FlexContainer>
  );
};

export default TournamentBrackets;
