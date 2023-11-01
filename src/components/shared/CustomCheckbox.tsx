import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox, Tooltip, Typography, useTheme } from '@mui/material';

interface IProps {
  tooltip?: string;
  label?: string;
  checked?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
}

const CustomCheckbox: React.FC<IProps> = ({
  tooltip,
  label,
  checked,
  onChange,
}) => {
  const theme = useTheme();

  if (!tooltip) {
    return (
      <div>
        <Checkbox size="small" checked={checked} onChange={onChange} />
        <Typography variant="body1">{label}</Typography>
      </div>
    );
  }
  return (
    <div>
      <Checkbox size="small" checked={checked} onChange={onChange} />
      <Typography variant="body1">
        {label}
        <Tooltip title={tooltip} arrow enterDelay={500}>
          <FontAwesomeIcon
            icon={faInfoCircle}
            color={theme.palette.text.disabled}
          />
        </Tooltip>
      </Typography>
    </div>
  );
};

export default CustomCheckbox;
