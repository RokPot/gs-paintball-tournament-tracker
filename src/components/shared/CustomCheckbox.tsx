import FlexContainer from './FlexContainer';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox, Tooltip, Typography, useTheme } from '@mui/material';
import { useCallback } from 'react';

interface IProps {
  tooltip?: string;
  label?: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
}

const CustomCheckbox: React.FC<IProps> = ({
  tooltip,
  label,
  checked,
  onChange,
}) => {
  const theme = useTheme();

  const internalToggleCheckbox = useCallback(
    () => onChange(!checked),
    [onChange, checked]
  );

  if (!tooltip) {
    return (
      <div>
        <Checkbox
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
      style={{ marginBottom: '0px', cursor: 'pointer' }}
      onClick={internalToggleCheckbox}
    >
      <Checkbox
        size="small"
        checked={checked}
        onChange={internalToggleCheckbox}
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
