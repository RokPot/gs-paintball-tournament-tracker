import LogoImage from '../../../../assets/logo3.svg';
import LogoTextImage from '../../../../assets/logo_text.svg';
import CustomMenuItem from './CustomMenuItem';
import {
  faBars,
  faChartSimple,
  faHouse,
  faNetworkWired,
  faPeopleGroup,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Typography, alpha, styled, useTheme } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import { Menu, Sidebar } from 'react-pro-sidebar';

const StyledMenuButtonContainer = styled('div')(
  (props) => `
    display: flex;
    width: 100%;
  
  `
);
const StyledLogoContainer = styled('div')(
  (props) => `
    display: flex;
    width: 100%;
    height: 100px;
    justify-content: center;
    align-items: center;
    position: relative;
  `
);

const navBarItems = [
  {
    icon: faHouse,
    path: '/',
    title: 'Home',
    to: '/',
  },
  {
    icon: faPeopleGroup,
    path: '/teams/*',
    title: 'Teams',
    to: '/teams',
  },
  {
    icon: faTicket,
    path: '/leagues/*',
    title: 'Leagues',
    to: '/leagues',
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

const SidebarNav: React.FC = () => {
  const theme = useTheme();
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  return (
    <Sidebar
      width="180px"
      collapsed={isMenuCollapsed}
      backgroundColor={theme.palette.background.paper}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <StyledLogoContainer>
          <img className="logo-image" src={LogoImage} width={65} height={95} />
          <div
            className={clsx(
              'logo-text',
              isMenuCollapsed ? 'collapsed' : 'open'
            )}
          >
            {true && <img src={LogoTextImage} width={90} height={40} />}
          </div>
        </StyledLogoContainer>

        <StyledMenuButtonContainer>
          <IconButton
            size="small"
            onClick={() => setIsMenuCollapsed((old) => !old)}
            className={clsx(
              'menu-icon',
              isMenuCollapsed ? 'collapsed' : 'open'
            )}
          >
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
        </StyledMenuButtonContainer>
        <div style={{ flex: '1' }}>
          <Menu
            style={{ display: 'flex', flexDirection: 'column' }}
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
        </div>

        <Typography marginTop="auto">League</Typography>
        <Typography marginTop="auto">Gluhi Svizci pokal 2022</Typography>
        <Typography marginTop="auto">Tournament</Typography>
        <Typography marginTop="auto">2. Turnir 15/9/2022</Typography>
      </div>
    </Sidebar>
  );
};

export default SidebarNav;
