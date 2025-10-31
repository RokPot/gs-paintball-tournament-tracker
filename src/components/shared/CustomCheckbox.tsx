import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox, Tooltip, Typography, useTheme } from '@mui/material';
import { useCallback } from 'react';
import FlexContainer from './FlexContainer';

interface IProps {
  tooltip?: string;
  label?: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const CustomCheckbox: React.FC<IProps> = ({
  tooltip,
  label,
  checked,
  onChange,
  disabled,
}) => {
  const theme = useTheme();

  const internalToggleCheckbox = useCallback(
    () => !disabled && onChange(!checked),
    [disabled, onChange, checked],
  );

  if (!tooltip) {
    return (
      <div>
        <Checkbox
          disabled={disabled}
          size="small"
          checked={checked}
          onChange={internalToggleCheckbox}
        />
        <Typography variant="body1">{label}</Typography>
      </div>
    );
  }
  return (
    <FlexContainer
      width="100%"
      justifyContent="flex-start"
      alignItems="center"
      style={{ marginBottom: '0px', cursor: disabled ? 'default' : 'pointer' }}
      onClick={internalToggleCheckbox}
    >
      <Checkbox
        disabled={disabled}
        size="small"
        checked={checked}
        onChange={internalToggleCheckbox}
        sx={{
          padding: '4px',
        }}
      />
      <Typography variant="body1">
        {label}
        <Tooltip title={tooltip} arrow enterDelay={500}>
          <FontAwesomeIcon
            style={{ paddingLeft: '8px' }}
            icon={faInfoCircle}
            color={theme.palette.text.disabled}
          />
        </Tooltip>
      </Typography>
    </FlexContainer>
  );
};

export default CustomCheckbox;
