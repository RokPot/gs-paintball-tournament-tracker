import { Button, Chip, Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { SerialPortStatus } from 'main/serialPortListener/buttonReceiverConfig';
import React from 'react';

const statusLabel = (status?: SerialPortStatus) => {
  switch (status?.state) {
    case 'connected':
      return `Receiver connected${
        status.portPath ? ` (${status.portPath})` : ''
      }`;
    case 'connecting':
      return 'Connecting receiver…';
    case 'reconnecting':
      return 'Reconnecting receiver…';
    case 'error':
      return status.message || 'Receiver error';
    default:
      return 'Plug in the button receiver';
  }
};

const statusColor = (
  status?: SerialPortStatus,
): 'success' | 'warning' | 'error' | 'default' => {
  switch (status?.state) {
    case 'connected':
      return 'success';
    case 'connecting':
    case 'reconnecting':
      return 'warning';
    case 'error':
      return 'error';
    default:
      return 'default';
  }
};

interface IProps {
  connectionStatus?: SerialPortStatus;
  onReconnect?: () => void;
  compact?: boolean;
}

const ButtonReceiverStatus: React.FC<IProps> = ({
  connectionStatus,
  onReconnect,
  compact = false,
}) => {
  return (
    <FlexContainer alignItems="center" gap={8} flexWrap="wrap">
      <Chip
        color={statusColor(connectionStatus)}
        label={statusLabel(connectionStatus)}
        variant={
          connectionStatus?.state === 'connected' ? 'filled' : 'outlined'
        }
      />
      {onReconnect && (
        <Button size="small" variant="outlined" onClick={onReconnect}>
          Reconnect
        </Button>
      )}
      {!compact && connectionStatus?.state === 'disconnected' && (
        <Typography variant="p3Medium">
          The receiver is detected automatically when you plug it in.
        </Typography>
      )}
    </FlexContainer>
  );
};

export default ButtonReceiverStatus;
