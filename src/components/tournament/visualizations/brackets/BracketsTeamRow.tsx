import { Typography, css, styled } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import React from 'react';
import Team from 'types/Team';

const StyledTeamNameContainer = styled('div')(
  (props) => css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1.5px solid ${props.theme.palette.primary.light};
    background: ${props.theme.palette.primary.main};
    padding: 4px 8px 4px 8px;
    width: 150px;
    border-radius: 7px 0px 0px 7px;
    height: 40px;
  `,
);
const StyledTeamScoreContainer = styled('div')(
  (props) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid ${props.theme.palette.primary.light};
    background: ${props.theme.palette.primary.dark};
    padding: 4px;
    width: 40px;
    border-radius: 0px 7px 7px 0px;
    height: 40px;
  `,
);

interface IProps {
  team: Team;
  teamScore: number;
}

const BracketsTeamRow: React.FC<IProps> = ({ team, teamScore }) => {
  return (
    <FlexContainer flexDirection="row">
      <StyledTeamNameContainer>
        <Typography
          variant="p1"
          color={(theme) => theme.palette.primary.contrastText}
        >
          {team.teamName}
        </Typography>
      </StyledTeamNameContainer>
      <StyledTeamScoreContainer>
        <Typography
          variant="p1Bold"
          color={(theme) => theme.palette.primary.contrastText}
        >
          {teamScore}
        </Typography>
      </StyledTeamScoreContainer>
    </FlexContainer>
  );
};

export default BracketsTeamRow;
