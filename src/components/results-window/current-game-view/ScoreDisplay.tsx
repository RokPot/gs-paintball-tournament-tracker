import { Theme, Typography, css, lighten, styled } from '@mui/material';

const StyledContainer = styled('div')(
  (props: { theme?: Theme }) => css`
    text-align: center;
    border-radius: 4px;
    box-shadow: 0px 0px 5px 0px ${props.theme?.palette.primary.main};
    background: ${lighten(props.theme?.palette.primary.main || 'fff', 0.5)};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
  `,
);

interface IProps {
  teamWins: number;
  fontSize: string;
}

const ScoreDisplay: React.FC<IProps> = ({ teamWins, fontSize }) => {
  return (
    <StyledContainer>
      <Typography
        variant="p1"
        fontWeight="500"
        fontSize={fontSize}
        lineHeight="1em"
        padding="0.05em 0.15em"
      >
        {teamWins}
      </Typography>
    </StyledContainer>
  );
};
export default ScoreDisplay;
