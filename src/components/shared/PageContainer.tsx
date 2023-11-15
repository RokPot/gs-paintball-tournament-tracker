import { Container, css, styled } from '@mui/material';

const StyledRootContainer = styled('div')(
  (props) => css`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    padding: 16px 16px;
    overflow: auto;
  `
);
interface IProps {
  children: React.ReactNode;
  padding?: string;
}
const PageContainer: React.FC<IProps> = ({ children, padding }) => {
  return (
    <Container maxWidth={false} style={{ overflow: 'auto', padding: '0px' }}>
      <StyledRootContainer style={{ padding: padding }}>
        {children}
      </StyledRootContainer>
    </Container>
  );
};

export default PageContainer;
