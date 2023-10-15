import { Box, Modal, css, styled } from '@mui/material';

const StyledModalContainerRoot = styled('div')(
  () => css`
    position: relative;
    width: 100%;
    height: 100%;
  `
);
const StyledModalContainer = styled('div')(
  (props) => css`
    background-color: ${props.theme.palette.background.default};
    max-height: 700px;
    overflow-y: auto;
  `
);

interface IProps {
  isModalOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
  maxHeight?: number;
}
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};
const CustomModal: React.FC<IProps> = ({
  isModalOpen,
  onClose,
  children,
  width = 400,
  maxHeight = 700,
}) => {
  return (
    <Modal open={isModalOpen} onClose={onClose}>
      <Box style={style}>
        <StyledModalContainer style={{ width: width }}>
          {children}
        </StyledModalContainer>
      </Box>
    </Modal>
  );
};

export default CustomModal;
