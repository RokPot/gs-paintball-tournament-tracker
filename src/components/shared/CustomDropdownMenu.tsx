import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

interface MenuItemProps {
  icon?: IconDefinition;
  label: string;
  onClick: () => void;
  visible?: boolean;
}

interface IProps {
  actions: MenuItemProps[];
  label?: string;
  icon?: IconDefinition;
}

const CustomDropdownMenu = ({ actions, label, icon }: IProps) => {
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null,
  );
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{ width: '40px' }}
      >
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            width={5}
            color={theme.palette.primary.main}
          />
        )}
        {label}
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {actions
          .filter((action) => action.visible)
          .map((action, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                action.onClick();
                handleClose();
              }}
            >
              {action.icon && (
                <ListItemIcon>
                  <FontAwesomeIcon icon={action.icon} />
                </ListItemIcon>
              )}
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default CustomDropdownMenu;
