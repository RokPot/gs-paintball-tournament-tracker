import SidebarNav from './Navbar/SidebarNav';
import { styled } from '@mui/material';

const LayoutContainer = styled('div')(
  (props) => `
  display: flex;
  width: 100%;
  position: relative;
  height: 100vh;
  background-color: ${props.theme.palette.background.default};
  overflow: hidden;
`
);

interface IProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<IProps> = ({ children, className }) => {
  return (
    <LayoutContainer className={className}>
      <SidebarNav />
      {children}
    </LayoutContainer>
  );
};

export default styled(Layout)`
  .menu-icon {
    transition: all 0.5s;
    transform: rotate(180deg);
    margin-left: 25px;
  }
  .menu-icon.collapsed {
    transform: rotate(180deg);
  }
  .menu-icon.open {
    transform: rotate(0deg);
  }
  .logo-text {
    transition: all 0.3s;
    height: 100%;
    display: flex;
    align-items: end;
    padding-bottom: 5px;
    padding-left: 45px;
    width: 120px;
  }
  .logo-text.open {
    width: 120px;
    opacity: 1;
  }
  .logo-text.collapsed {
    width: 120px;
    opacity: 0;
    padding-left: 0px;
  }
  .logo-image {
    position: absolute;
    left: 7px;
  }
`;
