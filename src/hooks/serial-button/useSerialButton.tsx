import useIPCRendererMessages, {
  PortInfo,
} from 'hooks/main/useIPCRendererMessages';
import {
  SerialConnectionState,
  SerialPortStatus,
} from 'main/serialPortListener/buttonReceiverConfig';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  snackbarErrorOptions,
  snackbarSuccessOptions,
} from 'utils/snackbarUtils';

const DISCONNECTED_STATES: SerialConnectionState[] = [
  'disconnected',
  'reconnecting',
  'error',
];

const useSerialButton = (onButtonClicked: (data: any) => void) => {
  const [availablePorts, setAvailablePorts] = useState<PortInfo[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<SerialPortStatus>({
    state: 'disconnected',
    message: 'Waiting for button receiver',
  });
  const previousStateRef = useRef<SerialConnectionState | undefined>();
  const hasShownDisconnectToastRef = useRef(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    listenToButtonsResponse,
    sendGetReceiverPortsList,
    listenToGetReceiverPortsListResponse,
    sendReceiversSelectedSerialPort,
    sendReconnectSerialPort,
    sendGetSerialPortStatus,
    listenToSerialPortStatus,
  } = useIPCRendererMessages();

  const getAvailablePorts = useCallback(() => {
    sendGetReceiverPortsList();
    listenToGetReceiverPortsListResponse((result) => {
      setAvailablePorts(result as unknown as PortInfo[]);
    });
  }, [listenToGetReceiverPortsListResponse, sendGetReceiverPortsList]);

  const selectReceiverPort = useCallback(
    (port: PortInfo) => {
      sendReceiversSelectedSerialPort(port);
    },
    [sendReceiversSelectedSerialPort],
  );

  const reconnectReceiver = useCallback(() => {
    sendReconnectSerialPort();
  }, [sendReconnectSerialPort]);

  const onButtonsResponse = useCallback(
    (result: any) => {
      onButtonClicked(result);
    },
    [onButtonClicked],
  );

  useEffect(() => {
    const unsubscribeButtons = listenToButtonsResponse(onButtonsResponse);
    const unsubscribeStatus = listenToSerialPortStatus((status) => {
      setConnectionStatus(status);
    });
    getAvailablePorts();
    sendGetSerialPortStatus();
    return () => {
      unsubscribeButtons();
      unsubscribeStatus();
    };
  }, [
    getAvailablePorts,
    listenToButtonsResponse,
    listenToSerialPortStatus,
    onButtonsResponse,
    sendGetSerialPortStatus,
  ]);

  useEffect(() => {
    const nextState = connectionStatus.state;
    const previousState = previousStateRef.current;
    previousStateRef.current = nextState;

    if (!previousState) {
      return;
    }
    if (previousState === nextState) {
      return;
    }

    if (nextState === 'connected') {
      hasShownDisconnectToastRef.current = false;
      enqueueSnackbar(
        previousState === 'disconnected'
          ? 'Button receiver connected'
          : 'Button receiver reconnected',
        snackbarSuccessOptions,
      );
      getAvailablePorts();
      return;
    }

    if (
      DISCONNECTED_STATES.includes(nextState) &&
      !hasShownDisconnectToastRef.current
    ) {
      hasShownDisconnectToastRef.current = true;
      enqueueSnackbar(
        connectionStatus.message || 'Button receiver disconnected',
        snackbarErrorOptions,
      );
    }
  }, [
    connectionStatus.message,
    connectionStatus.state,
    enqueueSnackbar,
    getAvailablePorts,
  ]);

  return {
    getAvailablePorts,
    selectReceiverPort,
    reconnectReceiver,
    availablePorts,
    connectionStatus,
  };
};

export default useSerialButton;
