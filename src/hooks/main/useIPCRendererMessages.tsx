import { SerialPortStatus } from 'main/serialPortListener/buttonReceiverConfig';
import { useCallback, useMemo } from 'react';

enum IPCChannels {
  openNewWindow = 'openNewWindow',
  getPortsList = 'getPortsList',
  setSelectedPort = 'setSelectedPort',
  getPortsListResponse = 'getPortsListResponse',
  selectSerialPort = 'selectSerialPort',
  reconnectSerialPort = 'reconnectSerialPort',
  getSerialPortStatus = 'getSerialPortStatus',
  buttonsResponse = 'buttonsResponse',
  serialPortError = 'serialPortError',
  serialPortStatus = 'serialPortStatus',
  gameSwitched = 'gameSwitched',
  tournamentSwitched = 'tournamentSwitched',
  timerUpdate = 'timerUpdate',
  resultsSnapshot = 'resultsSnapshot',
  requestResultsSnapshot = 'requestResultsSnapshot',
}

export type Channels =
  | 'ipc-example'
  | 'ipc-example-response'
  | 'openNewWindow'
  | 'getPortsList'
  | 'setSelectedPort'
  | 'getPortsListResponse'
  | 'selectSerialPort'
  | 'reconnectSerialPort'
  | 'getSerialPortStatus'
  | 'buttonsResponse'
  | 'serialPortError'
  | 'serialPortStatus'
  | 'timerUpdate'
  | 'resultsSnapshot'
  | 'requestResultsSnapshot';

export interface TimerData {
  duration: number;
  currentDuration: number;
  breakDuration: number;
  timingBreak: boolean;
  timingGame: boolean;
}

enum ChannelsEnum {
  openNewWindow = 'openNewWindow',
  getPortsList = 'getPortsList',
  setSelectedPort = 'setSelectedPort',
  getPortsListResponse = 'getPortsListResponse',
  selectSerialPort = 'selectSerialPort',
  reconnectSerialPort = 'reconnectSerialPort',
  getSerialPortStatus = 'getSerialPortStatus',
  buttonsResponse = 'buttonsResponse',
  serialPortError = 'serialPortError',
  serialPortStatus = 'serialPortStatus',
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
      return window.electron.ipcRenderer.on(
        IPCChannels.buttonsResponse,
        (result) => {
          callback(result);
        },
      );
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

  const sendReconnectSerialPort = useCallback(() => {
    window.electron.ipcRenderer.sendMessage(IPCChannels.reconnectSerialPort);
  }, []);

  const sendGetSerialPortStatus = useCallback(() => {
    window.electron.ipcRenderer.sendMessage(IPCChannels.getSerialPortStatus);
  }, []);

  const listenToSerialPortStatus = useCallback(
    (callback: (status: SerialPortStatus) => void) => {
      return window.electron.ipcRenderer.on(
        IPCChannels.serialPortStatus,
        (status) => {
          callback(status as SerialPortStatus);
        },
      );
    },
    [],
  );

  const listenToSerialPortErrors = useCallback(
    (callback: (result: any) => void) => {
      return window.electron.ipcRenderer.on(
        IPCChannels.serialPortError,
        (result) => {
          callback(result);
        },
      );
    },
    [],
  );

  const sendGameSwitched = useCallback(() => {
    window.electron.ipcRenderer.sendMessage(IPCChannels.gameSwitched);
  }, []);

  const listenToGameSwitched = useCallback(
    (callback: (result: any) => void) => {
      return window.electron.ipcRenderer.on('gamesSwitched', (result) => {
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
      return window.electron.ipcRenderer.on('tournamentSwitched', (result) => {
        callback(result);
      });
    },
    [],
  );

  const sendTimerUpdate = useCallback((timerData: TimerData) => {
    window.electron.ipcRenderer.sendMessage(IPCChannels.timerUpdate, timerData);
  }, []);

  const listenToTimerUpdate = useCallback(
    (callback: (timerData: TimerData) => void) => {
      return window.electron.ipcRenderer.on(
        IPCChannels.timerUpdate,
        (timerData: unknown) => {
          callback(timerData as TimerData);
        },
      );
    },
    [],
  );

  const sendResultsSnapshot = useCallback((snapshot: unknown) => {
    window.electron.ipcRenderer.sendMessage(
      IPCChannels.resultsSnapshot,
      snapshot,
    );
  }, []);

  const listenToResultsSnapshot = useCallback(
    (callback: (snapshot: unknown) => void) => {
      return window.electron.ipcRenderer.on(
        IPCChannels.resultsSnapshot,
        (snapshot: unknown) => {
          callback(snapshot);
        },
      );
    },
    [],
  );

  const requestResultsSnapshot = useCallback(() => {
    window.electron.ipcRenderer.sendMessage(IPCChannels.requestResultsSnapshot);
  }, []);

  const listenToRequestResultsSnapshot = useCallback((callback: () => void) => {
    return window.electron.ipcRenderer.on(
      IPCChannels.requestResultsSnapshot,
      () => {
        callback();
      },
    );
  }, []);

  return useMemo(
    () => ({
      openNewResultsWindow,
      listenToButtonsResponse,
      sendGetReceiverPortsList,
      listenToGetReceiverPortsListResponse,
      sendReceiversSelectedSerialPort,
      sendReconnectSerialPort,
      sendGetSerialPortStatus,
      listenToSerialPortStatus,
      listenToSerialPortErrors,
      sendGameSwitched,
      listenToGameSwitched,
      listenToTournamentSwitched,
      sendTournamentSwitched,
      sendTimerUpdate,
      listenToTimerUpdate,
      sendResultsSnapshot,
      listenToResultsSnapshot,
      requestResultsSnapshot,
      listenToRequestResultsSnapshot,
    }),
    [
      listenToButtonsResponse,
      listenToGameSwitched,
      listenToGetReceiverPortsListResponse,
      listenToSerialPortErrors,
      listenToSerialPortStatus,
      openNewResultsWindow,
      sendGameSwitched,
      sendGetReceiverPortsList,
      sendReceiversSelectedSerialPort,
      sendReconnectSerialPort,
      sendGetSerialPortStatus,
      listenToTournamentSwitched,
      sendTournamentSwitched,
      sendTimerUpdate,
      listenToTimerUpdate,
      sendResultsSnapshot,
      listenToResultsSnapshot,
      requestResultsSnapshot,
      listenToRequestResultsSnapshot,
    ],
  );
};

export default useIPCRendererMessages;
