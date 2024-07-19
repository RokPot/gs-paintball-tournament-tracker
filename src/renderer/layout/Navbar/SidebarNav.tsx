import {
  faBars,
  faChartSimple,
  faHouse,
  faNetworkWired,
  faPeopleGroup,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconButton,
  Typography,
  alpha,
  lighten,
  styled,
  useTheme,
} from '@mui/material';
import clsx from 'clsx';
import FlexContainer from 'components/shared/FlexContainer';
import { useState } from 'react';
import { Menu, Sidebar } from 'react-pro-sidebar';
import routes from 'renderer/main/Routes';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import LogoImage from '../../../../assets/logo3.svg';
import LogoTextImage from '../../../../assets/logo_text.svg';
import CustomMenuItem from './CustomMenuItem';

const StyledMenuButtonContainer = styled('div')(
  () => `
    display: flex;
    width: 100%;

  `,
);
const StyledLogoContainer = styled('div')(
  () => `
    display: flex;
    width: 100%;
    height: 100px;
    justify-content: center;
    align-items: center;
    position: relative;
  `,
);

const navBarItems = [
  {
    icon: faHouse,
    path: '/',
    title: 'Home',
    to: routes.HOME,
  },
  {
    icon: faPeopleGroup,
    path: '/teams/*',
    title: 'Teams',
    to: routes.TEAMS,
  },
  {
    icon: faTicket,
    path: '/leagues/*',
    title: 'Leagues',
    to: routes.LEAGUES,
  },

  {
    icon: faNetworkWired,
    path: '/tournament/*',
    title: 'Tournament',
    to: routes.getTournamentRoute(),
  },
  {
    icon: faChartSimple,
    path: '/scoreboard/*',
    title: 'Scoreboard',
    to: routes.SCOREBOARD,
  },
];

const SidebarNav: React.FC = () => {
  const theme = useTheme();
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const { data: activeLeague } = LeagueQueries.useActiveLeague();
  return (
    <Sidebar
      width="180px"
      collapsed={isMenuCollapsed}
      backgroundColor={theme.palette.background.paper}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <StyledLogoContainer>
          <img
            className="logo-image"
            src={LogoImage}
            width={65}
            height={95}
            alt="logo"
          />
          <div
            className={clsx(
              'logo-text',
              isMenuCollapsed ? 'collapsed' : 'open',
            )}
          >
            {true && (
              <img src={LogoTextImage} width={90} height={40} alt="logo" />
            )}
          </div>
        </StyledLogoContainer>

        <StyledMenuButtonContainer>
          <IconButton
            size="small"
            onClick={() => setIsMenuCollapsed((old) => !old)}
            className={clsx(
              'menu-icon',
              isMenuCollapsed ? 'collapsed' : 'open',
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
                if (level === 0) {
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
                }
                return {};
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

        <FlexContainer
          style={{
            marginTop: 'auto',
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
          flexDirection="column"
          padding="4px"
          alignItems="flex-start"
        >
          <Typography variant="p2Medium" color={theme.palette.text.secondary}>
            League
          </Typography>
          <div
            style={{
              background: lighten(theme.palette?.primary.light, 0.8),
              borderRadius: '5px',
              boxShadow: `0 4px 4px ${lighten(
                theme.palette?.primary.light,
                0.5,
              )}`,
              width: '100%',
              padding: '0px 4px',
              textAlign: 'center',
            }}
          >
            <Typography variant="p1Medium" color={theme.palette.text.primary}>
              {activeLeague?.name}
            </Typography>
          </div>
          <Typography variant="p2Medium" color={theme.palette.text.secondary}>
            Tournament
          </Typography>
          <div
            style={{
              background: lighten(theme.palette?.primary.light, 0.9),
              borderRadius: '5px',
              boxShadow: `0 4px 4px ${lighten(
                theme.palette?.primary.light,
                0.5,
              )}`,
              width: '100%',
              padding: '0px 4px',
              textAlign: 'center',
            }}
          >
            <Typography variant="p1Medium" color={theme.palette.text.primary}>
              2. Turnir 15/9/2022
              {activeLeague?.activeTournament?.name}
            </Typography>
          </div>
        </FlexContainer>
      </div>
    </Sidebar>
  );
};

export default SidebarNav;
