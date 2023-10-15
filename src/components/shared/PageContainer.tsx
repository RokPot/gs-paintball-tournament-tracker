import { Container, css, styled } from '@mui/material';

const StyledRootContainer = styled('div')(
  (props) => css`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    padding: 16px 0px;
  `
);
interface IProps {
  children: React.ReactNode;
}
const PageContainer: React.FC<IProps> = ({ children }) => {
  return (
    <Container maxWidth={false}>
      <StyledRootContainer>{children}</StyledRootContainer>
    </Container>
  );
};

export default PageContainer;
