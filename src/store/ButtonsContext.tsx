import { PortInfo } from 'hooks/main/useIPCRendererMessages';
import useSerialButton from 'hooks/serial-button/useSerialButton';
import React, { useCallback, useMemo, useState } from 'react';
import { dispatch } from 'use-bus';

interface ButtonState {
  button1HandshakeConfirmed?: boolean;
  button2HandshakeConfirmed?: boolean;
}

export type ButtonsContextProps = {
  selectedPort?: PortInfo;
  buttonState?: ButtonState;
  setSelectedPort?: (selectedPort: PortInfo) => void;
  setButtonState?: (buttonState: ButtonState) => void;
  availablePorts?: PortInfo[];
  refreshAvailablePorts?: () => void;
  selectReceiverPort?: (port: PortInfo) => void;
};

export const ButtonsContext = React.createContext<ButtonsContextProps>({});

const ButtonsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedPort, setSelectedPort] = useState<PortInfo | undefined>();
  const [buttonState, setButtonState] = useState<ButtonState>({
    button1HandshakeConfirmed: false,
    button2HandshakeConfirmed: false,
  });

  const onButtonClicked = useCallback((ButtonClicked: string) => {
    dispatch({ type: 'ButtonClicked', payload: ButtonClicked });

    dispatch({ type: 'FinishMatch', payload: ButtonClicked });
  }, []);

  const { availablePorts, getAvailablePorts, selectReceiverPort } =
    useSerialButton(onButtonClicked);

  const contextValue = useMemo(
    () => ({
      selectedPort,
      setSelectedPort,
      buttonState,
      setButtonState,
      availablePorts,
      refreshAvailablePorts: getAvailablePorts,
      selectReceiverPort,
    }),
    [
      availablePorts,
      buttonState,
      getAvailablePorts,
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
