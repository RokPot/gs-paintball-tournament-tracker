import styled from '@emotion/styled';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Card,
  CardHeader,
  IconButton,
  Typography,
  css,
} from '@mui/material';
import PageContainer from 'components/shared/PageContainer';
import { PortInfo } from 'main/serialPortListener/serialPortListener';

const StyledStackingContainer = styled('div')(
  () => css`
    display: flex;
    width: 100%;
    flex-direction: row;
    gap: 15px;
  `,
);
const HomePage: React.FC = () => {
  const tryyy = () => {
    window.electron.ipcRenderer.sendMessage('get-ports-list');
    window.electron.ipcRenderer.once('get-ports-list-response', (result) => {
      console.log(result);
      const ports = result as unknown as PortInfo[];
      window.electron.ipcRenderer.sendMessage('select-serial-port', ports[1]);
    });
  };

  window.electron.ipcRenderer.on('buttons-response', (result) => {
    console.log(result);
  });

  return (
    <PageContainer>
      <Typography variant="h6">Leagues</Typography>
      <StyledStackingContainer onClick={tryyy}>
        <Card style={{ width: '400px' }}>
          <CardHeader
            action={
              <IconButton aria-label="settings">
                <FontAwesomeIcon icon={faCogs} width={15} />
              </IconButton>
            }
            title="SLO Cup 2022"
            subheader="22.5.2022 - 30.10.2022"
          />
        </Card>
        <Card>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'red' }} aria-label="recipe">
                R
              </Avatar>
            }
            action={<IconButton aria-label="settings" />}
            title="Shrimp and Chorizo Paella"
            subheader="September 14, 2016"
          />
        </Card>
        <Card>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'red' }} aria-label="recipe">
                R
              </Avatar>
            }
            action={<IconButton aria-label="settings" />}
            title="Shrimp and Chorizo Paella"
            subheader="September 14, 2016"
          />
        </Card>
        <Card>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'red' }} aria-label="recipe">
                R
              </Avatar>
            }
            action={<IconButton aria-label="settings" />}
            title="Shrimp and Chorizo Paella"
            subheader="September 14, 2016"
          />
        </Card>
      </StyledStackingContainer>

      <Typography variant="h6">Latest</Typography>
    </PageContainer>
  );
};

export default HomePage;
