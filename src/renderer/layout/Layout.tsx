import CustomMenuItem from './Navbar/CustomMenuItem';
import {
  faChartSimple,
  faHouse,
  faNetworkWired,
  faPeopleGroup,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon, Typography, alpha, styled, useTheme } from '@mui/material';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { Link, matchPath, useLocation } from 'react-router-dom';

const LayoutContainer = styled('div')(
  (props) => `
  display: flex;
  width: 100%;
  position: relative;
  height: 100vh;
  background-color: ${props.theme.palette.background.default};
`
);

interface IProps {
  children: React.ReactNode;
}

const navBarItems = [
  {
    icon: faHouse,
    path: '/',
    title: 'Home',
    to: '/',
  },
  {
    icon: faTicket,
    path: '/leagues/*',
    title: 'Leagues',
    to: '/leagues',
  },
  {
    icon: faPeopleGroup,
    path: '/teams/*',
    title: 'Teams',
    to: '/teams',
  },
  {
    icon: faNetworkWired,
    path: '/tournament/*',
    title: 'Tournament',
    to: '/tournament',
  },
  {
    icon: faChartSimple,
    path: '/scoreboard/*',
    title: 'Scoreboard',
    to: '/scoreboard',
  },
];

const Layout: React.FC<IProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <LayoutContainer>
      <Sidebar
        width="200px"
        collapsed={false}
        backgroundColor={theme.palette.background.paper}
      >
        <Typography>GS Paintball Tournament Tracker</Typography>
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => {
              if (level === 0)
                return {
                  color: active
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary,
                  fontWeight: active
                    ? theme.typography.fontWeightBold
                    : theme.typography.fontWeightMedium,
                  transition: 'background 0.3s',
                  background: active
                    ? alpha(theme.palette.primary.main, 0.3)
                    : theme.palette.background.default,
                  ':hover': {
                    background: alpha(theme.palette.primary.light, 0.2),
                  },
                };
            },
          }}
        >
          {navBarItems.map((item, index) => (
            <CustomMenuItem
              icon={item.icon}
              path={item.path}
              title={item.title}
              to={item.to}
              key={index}
            />
          ))}
        </Menu>
      </Sidebar>
      {children}
    </LayoutContainer>
  );
};

export default Layout;
