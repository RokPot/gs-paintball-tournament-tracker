import { PortInfo } from 'hooks/main/useIPCRendererMessages';
import React, { useMemo, useState } from 'react';

interface ButtonState {
  button1HandshakeConfirmed?: boolean;
  button2HandshakeConfirmed?: boolean;
}

export type ButtonsContextProps = {
  selectedPort?: PortInfo;
  buttonState?: ButtonState;
  setSelectedPort?: (selectedPort: PortInfo) => void;
  setButtonState?: (buttonState: ButtonState) => void;
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
  const contextValue = useMemo(
    () => ({
      selectedPort,
      setSelectedPort,
      buttonState,
      setButtonState,
    }),
    [buttonState, selectedPort],
  );
  return (
    <ButtonsContext.Provider value={contextValue}>
      {children}
    </ButtonsContext.Provider>
  );
};

export default ButtonsProvider;
