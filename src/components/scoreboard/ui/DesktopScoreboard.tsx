import TeamScoreCard from '../TeamScoreCard';
import TimerStoreRenderComponent from '../TimerStoreRenderComponent';
import { Button, Card, Typography, alpha, styled } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { Game } from 'types/Game';

interface IProps {
  className?: string;
  startStopMatch: () => void;
  game?: Game;
}

const DesktopScoreboard: React.FC<IProps> = ({
  className,
  startStopMatch,
  game,
}) => {
  return (
    <FlexContainer
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      height="100%"
      width="100%"
      className={className}
      padding="8px"
      margin={8}
    >
      <FlexContainer
        flex={1}
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
        margin={8}
      >
        <TeamScoreCard />
        <Card className="custom-card counter-card">
          <FlexContainer
            flexDirection="column"
            width="100%"
            height="100%"
            justifyContent="space-between"
            alignItems="center"
          >
            <FlexContainer
              width="100%"
              flexDirection="column"
              alignItems="center"
            >
              <div className="header">
                <Typography
                  variant="h1Medium"
                  color={(theme) => theme.palette.primary.contrastText}
                  className="header-text"
                >
                  Game time
                </Typography>
              </div>

              <TimerStoreRenderComponent />
            </FlexContainer>

            <FlexContainer flexDirection="column" padding="0px 10px 0px 10px">
              <div className="header">
                <Typography
                  variant="h1Medium"
                  color={(theme) => theme.palette.primary.contrastText}
                  className="header-text"
                >
                  Countdown
                </Typography>
              </div>

              <Typography variant="h3Medium" className="break-text">
                05:00
              </Typography>
            </FlexContainer>
          </FlexContainer>
        </Card>
        <TeamScoreCard />
      </FlexContainer>
      <FlexContainer alignItems="flex-start">
        <Card className="custom-card actions-card">
          <FlexContainer
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            margin={8}
            padding="16px"
          >
            <FlexContainer flexDirection="column" margin={8}>
              <Button variant="contained" fullWidth size="large">
                <Typography variant="p1Medium">Team 1 Pause</Typography>
              </Button>
            </FlexContainer>
            <FlexContainer flexDirection="column" margin={8}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
              >
                <Typography variant="h3Medium">Finish Match</Typography>
              </Button>
              <Button
                variant="contained"
                size="large"
                color="primary"
                fullWidth
                onClick={startStopMatch}
              >
                <Typography variant="h3Medium">Start Game</Typography>
              </Button>
            </FlexContainer>
            <FlexContainer flexDirection="column" margin={8}>
              <Button variant="contained" size="large">
                <Typography variant="p1Medium">Team 2 Pause</Typography>
              </Button>
            </FlexContainer>
          </FlexContainer>
        </Card>
      </FlexContainer>
    </FlexContainer>
  );
};

export default styled(DesktopScoreboard)(
  (props) => `
    height: 100%;
    
    .custom-card {
      box-shadow: ${alpha(props.theme.palette.primary.main, 0.5)} 0px 5px 15px;
      border: solid 1px ${alpha(props.theme.palette.primary.main, 0.2)};  
    }

    .counter-card {
      min-width: 200px;
      max-width: 700px;
      width: 100%;
      height: 100%;
      max-height: 500px;
      min-height: 200px;
    }
    .header {
      background: ${props.theme.palette.primary.main};
      width: 100%;
      text-align: center;
      padding: 8px;
      border-radius: 2px 2px 20px 20px;
    }

    .header-text {
      font-size: 40px;
    }

    .break-text {
      font-size: 120px;
      line-height: normal;
    }
    .actions-card {
      height: 150px;
    }

    `
);
