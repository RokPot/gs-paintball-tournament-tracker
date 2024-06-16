import { Theme, Typography, css, lighten, styled } from '@mui/material';

const StyledContainer = styled('div')(
  (props: { fontSize: number } & { theme?: Theme }) => css`
    width: ${props.fontSize}px;
    height: ${props.fontSize}px;
    text-align: center;
    border-radius: 4px;
    box-shadow: 0px 0px 5px 0px ${props.theme?.palette.primary.main};
    background: ${lighten(props.theme?.palette.primary.main || 'fff', 0.5)};
    display: flex;
    justify-content: center;
    align-items: center;
  `,
);

interface IProps {
  teamWins: number;
}

const ScoreDisplay: React.FC<IProps> = ({ teamWins }) => {
  const fontSize = 80;

  return (
    <StyledContainer fontSize={fontSize}>
      <Typography
        variant="p1"
        fontWeight="500"
        fontSize={fontSize}
        marginBottom="5px"
      >
        {teamWins}
      </Typography>
    </StyledContainer>
  );
};
export default ScoreDisplay;
