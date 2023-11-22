import { Container, css, styled } from '@mui/material';

const StyledRootContainer = styled('div')(
  () => css`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    padding: 16px 16px;
    overflow: auto;
    position: relative;
  `,
);

interface IProps {
  children: React.ReactNode;
  padding?: string;
  flexWrap?: 'nowrap' | 'wrap';
}
function PageContainer({ children, padding, flexWrap }: IProps) {
  return (
    <Container maxWidth={false} style={{ overflow: 'auto', padding: '0px' }}>
      <StyledRootContainer style={{ padding, flexWrap }}>
        {children}
      </StyledRootContainer>
    </Container>
  );
}

export default PageContainer;
