import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Modal,
  Typography,
  css,
  styled,
  useTheme,
} from '@mui/material';
import FlexContainer from './FlexContainer';

const StyledModalContainer = styled('div')(
  (props) => css`
    background-color: ${props.theme.palette.background.default};
    max-height: 700px;
    overflow-y: auto;
  `,
);

interface IProps {
  isModalOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  width?: number;
  fullScreen?: boolean;
  title?: string;
  showHeader?: boolean;
  canClose?: boolean;
}
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};
const fullScreenStyle = {
  width: '100%',
  height: '100%',
};
const CustomModal = ({
  isModalOpen,
  onClose,
  children,
  width = 400,
  fullScreen,
  title,
  showHeader = false,
  canClose = true,
}: IProps) => {
  const theme = useTheme();
  return (
    <Modal open={isModalOpen} onClose={onClose}>
      <Box style={fullScreen ? fullScreenStyle : style}>
        <StyledModalContainer
          style={{
            width: fullScreen ? '100%' : width,
            height: fullScreen ? '100%' : 'auto',
            maxHeight: fullScreen ? '100%' : '',
          }}
        >
          {showHeader && (
            <FlexContainer
              width="100%"
              justifyContent="space-between"
              alignItems="center"
              position="sticky"
              top="0px"
              padding="5px 0px 5px 20px"
              zIndex={10}
              style={{
                backgroundColor: theme.palette.background.default,
                boxShadow: `0px 0px 8px 0px ${theme.palette.primary.dark}`,
              }}
            >
              <Typography variant="h1">{title}</Typography>

              {canClose && (
                <Button onClick={onClose}>
                  <FontAwesomeIcon icon={faClose} />
                </Button>
              )}
            </FlexContainer>
          )}

          {children}
        </StyledModalContainer>
      </Box>
    </Modal>
  );
};

export default CustomModal;
