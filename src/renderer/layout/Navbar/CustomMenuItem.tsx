import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography, useTheme } from '@mui/material';
import { MenuItem } from 'react-pro-sidebar';
import { Link, matchPath, useLocation } from 'react-router-dom';

interface IProps {
  path: string;
  icon: IconDefinition;
  title: string;
  to?: string;
}

const CustomMenuItem = ({ path, icon, title, to }: IProps) => {
  const { pathname } = useLocation();
  const isPathActive = !!matchPath(path, pathname);
  const theme = useTheme();

  return (
    <MenuItem
      active={isPathActive}
      component={<Link to={to ?? path} />}
      icon={
        <FontAwesomeIcon
          icon={icon}
          color={
            isPathActive
              ? theme.palette.primary.main
              : theme.palette.text.secondary
          }
        />
      }
    >
      <Typography color={theme.palette.primary.dark}>{title}</Typography>
    </MenuItem>
  );
};

export default CustomMenuItem;
