import { PortInfo } from 'hooks/main/useIPCRendererMessages';
import { create } from 'zustand';

interface ButtonState {
  button1HandshakeConfirmed?: boolean;
  button2HandshakeConfirmed?: boolean;
}

interface SerialButtonsStoreState {
  selectedPort?: PortInfo;
  buttonState?: ButtonState;
  setSelectedPort: (selectedPort: PortInfo) => void;
  setButtonState: (buttonState: ButtonState) => void;
}

const useSerialButtonsStore = create<SerialButtonsStoreState>((set) => ({
  selectedPort: undefined,
  buttonState: {
    button1HandshakeConfirmed: false,
    button2HandshakeConfirmed: false,
  },
  setSelectedPort: (selectedPort) => {
    set(() => ({ selectedPort }));
  },
  setButtonState: (buttonState) => {
    set(() => ({ buttonState }));
  },
}));

export default useSerialButtonsStore;
