import { useCallback, useMemo } from 'react';

enum IPCChannels {
  openNewWindow = 'openNewWindow',
  getPortsList = 'getPortsList',
  setSelectedPort = 'setSelectedPort',
  getPortsListResponse = 'getPortsListResponse',
  selectSerialPort = 'selectSerialPort',
  buttonsResponse = 'buttonsResponse',
  serialPortError = 'serialPortError',
  gameSwitched = 'gameSwitched',
  tournamentSwitched = 'tournamentSwitched',
}

export type Channels =
  | 'ipc-example'
  | 'ipc-example-response'
  | 'openNewWindow'
  | 'getPortsList'
  | 'setSelectedPort'
  | 'getPortsListResponse'
  | 'selectSerialPort'
  | 'buttonsResponse'
  | 'serialPortError';

enum ChannelsEnum {
  openNewWindow = 'openNewWindow',
  getPortsList = 'getPortsList',
  setSelectedPort = 'setSelectedPort',
  getPortsListResponse = 'getPortsListResponse',
  selectSerialPort = 'selectSerialPort',
  buttonsResponse = 'buttonsResponse',
  serialPortError = 'serialPortError',
}

export declare interface PortInfo {
  path: string;
  manufacturer: string | undefined;
  serialNumber: string | undefined;
  pnpId: string | undefined;
  locationId: string | undefined;
  productId: string | undefined;
  vendorId: string | undefined;
  friendlyName: string;
}

const useIPCRendererMessages = () => {
  const openNewResultsWindow = useCallback(() => {
    window.electron.ipcRenderer.sendMessage(
      ChannelsEnum.openNewWindow,
      'new_window.html',
    );
  }, []);

  const listenToButtonsResponse = useCallback(
    (callback: (result: any) => void) => {
      window.electron.ipcRenderer.on(IPCChannels.buttonsResponse, (result) => {
        callback(result);
      });
    },
    [],
  );

  const sendGetReceiverPortsList = useCallback(() => {
    window.electron.ipcRenderer.sendMessage('getPortsList');
  }, []);

  const listenToGetReceiverPortsListResponse = useCallback(
    (callback: (result: any) => void) => {
      window.electron.ipcRenderer.once(
        IPCChannels.getPortsListResponse,
        (result) => {
          callback(result);
        },
      );
    },
    [],
  );

  const sendReceiversSelectedSerialPort = useCallback((portInfo: PortInfo) => {
    window.electron.ipcRenderer.sendMessage(
      IPCChannels.selectSerialPort,
      portInfo,
    );
  }, []);

  const listenToSerialPortErrors = useCallback(
    (callback: (result: any) => void) => {
      window.electron.ipcRenderer.on(IPCChannels.serialPortError, (result) => {
        callback(result);
      });
    },
    [],
  );

  const sendGameSwitched = useCallback(() => {
    window.electron.ipcRenderer.sendMessage(IPCChannels.gameSwitched);
  }, []);

  const listenToGameSwitched = useCallback(
    (callback: (result: any) => void) => {
      window.electron.ipcRenderer.on('gamesSwitched', (result) => {
        callback(result);
      });
    },
    [],
  );

  const sendTournamentSwitched = useCallback(() => {
    window.electron.ipcRenderer.sendMessage(IPCChannels.tournamentSwitched);
  }, []);

  const listenToTournamentSwitched = useCallback(
    (callback: (result: any) => void) => {
      window.electron.ipcRenderer.on('tournamentSwitched', (result) => {
        callback(result);
      });
    },
    [],
  );

  return useMemo(
    () => ({
      openNewResultsWindow,
      listenToButtonsResponse,
      sendGetReceiverPortsList,
      listenToGetReceiverPortsListResponse,
      sendReceiversSelectedSerialPort,
      listenToSerialPortErrors,
      sendGameSwitched,
      listenToGameSwitched,
      listenToTournamentSwitched,
      sendTournamentSwitched,
    }),
    [
      listenToButtonsResponse,
      listenToGameSwitched,
      listenToGetReceiverPortsListResponse,
      listenToSerialPortErrors,
      openNewResultsWindow,
      sendGameSwitched,
      sendGetReceiverPortsList,
      sendReceiversSelectedSerialPort,
      listenToTournamentSwitched,
      sendTournamentSwitched,
    ],
  );
};

export default useIPCRendererMessages;
