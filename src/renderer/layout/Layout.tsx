import {
  faChartSimple,
  faHouse,
  faNetworkWired,
  faPeopleGroup,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon, Typography, styled, useTheme } from '@mui/material';
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

const Layout: React.FC<IProps> = ({ children }) => {
  const { pathname } = useLocation();
  const theme = useTheme();

  return (
    <LayoutContainer>
      <Sidebar width="200px" collapsed={false}>
        <Typography>GS Paintball Tournament Tracker</Typography>
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => {
              // only apply styles on first level elements of the tree
              if (level === 0)
                return {
                  color: active
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                };
            },
          }}
        >
          <MenuItem
            active={!!matchPath('/', pathname)}
            component={<Link to="/" />}
            icon={<FontAwesomeIcon icon={faHouse} />}
          >
            Home
          </MenuItem>
          <MenuItem
            active={!!matchPath('/leagues/*', pathname)}
            component={<Link to="/leagues" />}
            icon={<FontAwesomeIcon icon={faTicket} />}
          >
            Leagues
          </MenuItem>
          <MenuItem
            active={!!matchPath('/teams/*', pathname)}
            component={<Link to="/teams" />}
            icon={<FontAwesomeIcon icon={faPeopleGroup} />}
          >
            Teams
          </MenuItem>
          <MenuItem
            active={!!matchPath('/tournament/*', pathname)}
            component={<Link to="/tournament" />}
            icon={<FontAwesomeIcon icon={faNetworkWired} />}
          >
            Tournament
          </MenuItem>
          <MenuItem
            active={!!matchPath('/scoreboard/*', pathname)}
            component={<Link to="/scoreboard" />}
            icon={<FontAwesomeIcon icon={faChartSimple} />}
          >
            Scoreboard
          </MenuItem>
        </Menu>
      </Sidebar>
      {children}
    </LayoutContainer>
  );
};

export default Layout;
