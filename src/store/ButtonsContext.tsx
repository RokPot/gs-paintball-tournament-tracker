import { PortInfo } from 'hooks/main/useIPCRendererMessages';
import useSerialButton from 'hooks/serial-button/useSerialButton';
import { SerialPortStatus } from 'main/serialPortListener/buttonReceiverConfig';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { dispatch } from 'use-bus';

interface ButtonState {
  button1HandshakeConfirmed?: boolean;
  button2HandshakeConfirmed?: boolean;
}

export type ButtonsContextProps = {
  selectedPort?: PortInfo;
  buttonState?: ButtonState;
  setSelectedPort?: (selectedPort: PortInfo) => void;
  setButtonState?: React.Dispatch<React.SetStateAction<ButtonState>>;
  availablePorts?: PortInfo[];
  refreshAvailablePorts?: () => void;
  selectReceiverPort?: (port: PortInfo) => void;
  reconnectReceiver?: () => void;
  connectionStatus?: SerialPortStatus;
};

export const ButtonsContext = React.createContext<ButtonsContextProps>({});

const disconnectedButtonState: ButtonState = {
  button1HandshakeConfirmed: false,
  button2HandshakeConfirmed: false,
};

const ButtonsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedPort, setSelectedPort] = useState<PortInfo | undefined>();
  const [buttonState, setButtonState] = useState<ButtonState>(
    disconnectedButtonState,
  );

  const onButtonClicked = useCallback((ButtonClicked: string) => {
    dispatch({ type: 'ButtonClicked', payload: ButtonClicked });

    dispatch({ type: 'FinishMatch', payload: ButtonClicked });
  }, []);

  const {
    availablePorts,
    getAvailablePorts,
    selectReceiverPort,
    reconnectReceiver,
    connectionStatus,
  } = useSerialButton(onButtonClicked);

  useEffect(() => {
    if (connectionStatus?.state !== 'connected') {
      setButtonState(disconnectedButtonState);
      return;
    }

    const matchingPort = availablePorts.find(
      (port) => port.path === connectionStatus.portPath,
    );
    if (matchingPort) {
      setSelectedPort(matchingPort);
      return;
    }
    if (connectionStatus.portPath) {
      setSelectedPort({
        path: connectionStatus.portPath,
        manufacturer: undefined,
        serialNumber: undefined,
        pnpId: undefined,
        locationId: undefined,
        productId: undefined,
        vendorId: undefined,
        friendlyName: connectionStatus.portPath,
      });
    }
  }, [availablePorts, connectionStatus]);

  const contextValue = useMemo(
    () => ({
      selectedPort,
      setSelectedPort,
      buttonState,
      setButtonState,
      availablePorts,
      refreshAvailablePorts: getAvailablePorts,
      selectReceiverPort,
      reconnectReceiver,
      connectionStatus,
    }),
    [
      availablePorts,
      buttonState,
      connectionStatus,
      getAvailablePorts,
      reconnectReceiver,
      selectReceiverPort,
      selectedPort,
    ],
  );
  return (
    <ButtonsContext.Provider value={contextValue}>
      {children}
    </ButtonsContext.Provider>
  );
};

export default ButtonsProvider;
