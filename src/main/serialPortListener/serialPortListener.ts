import { ReadlineParser } from '@serialport/parser-readline';
import { BrowserWindow, ipcMain } from 'electron';
import { SerialPort } from 'serialport';
import {
  ButtonReceiverPort,
  findButtonReceiver,
  SerialPortStatus,
} from './buttonReceiverConfig';

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
  | 'gameSwitched'
  | 'gamesSwitched';

const BAUD_RATE = 115200;
const POLL_INTERVAL_MS = 1000;
const QUICK_OPEN_ATTEMPTS = 3;
const QUICK_RETRY_DELAY_MS = 500;
const BACKOFF_START_MS = 1000;
const BACKOFF_MAX_MS = 8000;

let targetWindow: BrowserWindow | null = null;
let serialPort: SerialPort | null = null;
let serialReadlineParser: ReadlineParser | null = null;
let ipcRegistered = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let intentionalClose = false;
let preferredPath: string | undefined;
let currentPath: string | undefined;
let hadSuccessfulConnection = false;
let nextOpenAllowedAt = 0;
let backoffMs = BACKOFF_START_MS;
let connectionLock: Promise<void> = Promise.resolve();

let currentStatus: SerialPortStatus = {
  state: 'disconnected',
  message: 'Waiting for button receiver',
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const logSerialError = (error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
};

const runInBackground = (work: Promise<void>) => {
  work.catch(logSerialError);
};

const runExclusive = (fn: () => Promise<void>): Promise<void> => {
  const run = connectionLock.then(fn, fn);
  connectionLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
};

const sendToRenderer = (channel: Channels, payload?: unknown) => {
  if (!targetWindow || targetWindow.isDestroyed()) {
    return;
  }
  targetWindow.webContents.send(channel, payload);
};

const setStatus = (status: SerialPortStatus) => {
  currentStatus = status;
  sendToRenderer('serialPortStatus', currentStatus);
};

const resetBackoff = () => {
  backoffMs = BACKOFF_START_MS;
  nextOpenAllowedAt = 0;
};

const bumpBackoff = () => {
  nextOpenAllowedAt = Date.now() + backoffMs;
  backoffMs = Math.min(backoffMs * 2, BACKOFF_MAX_MS);
};

const extractPortPath = (portData: unknown): string | undefined => {
  if (!portData || typeof portData !== 'object') {
    return undefined;
  }
  const data = portData as Record<string, unknown>;
  if (typeof data.path === 'string' && data.path) {
    return data.path;
  }
  const portInfo = data.portInfo as Record<string, unknown> | undefined;
  if (portInfo && typeof portInfo.path === 'string' && portInfo.path) {
    return portInfo.path;
  }
  return undefined;
};

const closePortInternal = async () => {
  const port = serialPort;
  const parser = serialReadlineParser;
  serialPort = null;
  serialReadlineParser = null;
  currentPath = undefined;

  parser?.removeAllListeners();

  if (!port) {
    return;
  }

  intentionalClose = true;
  port.removeAllListeners();

  if (port.isOpen) {
    await new Promise<void>((resolve) => {
      port.close(() => resolve());
    });
  }
  intentionalClose = false;
};

const handleUnexpectedDisconnect = async (message: string) => {
  await runExclusive(async () => {
    if (!serialPort && currentStatus.state !== 'connected') {
      return;
    }
    await closePortInternal();
    resetBackoff();
    setStatus({
      state: 'reconnecting',
      message,
    });
  });
};

const bindPortListeners = (instance: SerialPort, path: string) => {
  serialPort = instance;
  currentPath = path;
  serialReadlineParser = instance.pipe(new ReadlineParser({ delimiter: 'R' }));
  serialReadlineParser.addListener('data', (data) => {
    const payload = String(data).trim();
    if (payload === 'cp: 1') {
      sendToRenderer('buttonsResponse', 'Team1Button');
    } else if (payload === 'cp: 2') {
      sendToRenderer('buttonsResponse', 'Team2Button');
    }
  });

  instance.on('close', () => {
    if (intentionalClose) {
      return;
    }
    runInBackground(handleUnexpectedDisconnect('Button receiver disconnected'));
  });

  instance.on('error', (portError) => {
    if (intentionalClose) {
      return;
    }
    runInBackground(
      handleUnexpectedDisconnect(portError?.message || 'Button receiver error'),
    );
  });
};

const attachPort = (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const instance = new SerialPort(
      {
        baudRate: BAUD_RATE,
        path,
      },
      (error) => {
        if (error) {
          if (instance.isOpen) {
            instance.close();
          }
          reject(error);
          return;
        }
        bindPortListeners(instance, path);
        resolve();
      },
    );
  });
};

const openPortWithRetries = async (path: string, isReconnect: boolean) => {
  await closePortInternal();
  setStatus({
    state: isReconnect ? 'reconnecting' : 'connecting',
    portPath: path,
    message: isReconnect
      ? 'Reconnecting to button receiver'
      : 'Connecting to button receiver',
  });

  let lastError: Error | undefined;
  /* Sequential retries are required so Windows can release the COM handle. */
  /* eslint-disable no-await-in-loop */
  for (let attempt = 0; attempt < QUICK_OPEN_ATTEMPTS; attempt += 1) {
    if (attempt > 0) {
      await sleep(QUICK_RETRY_DELAY_MS);
    }
    try {
      await attachPort(path);
      hadSuccessfulConnection = true;
      resetBackoff();
      setStatus({
        state: 'connected',
        portPath: path,
        message: 'Button receiver connected',
      });
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }
  /* eslint-enable no-await-in-loop */

  bumpBackoff();
  const message = lastError?.message || 'Failed to open button receiver';
  sendToRenderer('serialPortError', message);
  setStatus({
    state: 'error',
    portPath: path,
    message,
  });
};

const listPorts = async (): Promise<ButtonReceiverPort[]> => {
  try {
    return (await SerialPort.list()) as ButtonReceiverPort[];
  } catch (error) {
    logSerialError(error);
    return [];
  }
};

const resolveTargetPort = (ports: ButtonReceiverPort[]) => {
  if (preferredPath) {
    const preferred = ports.find((port) => port.path === preferredPath);
    if (preferred) {
      return preferred;
    }
  }
  return findButtonReceiver(ports);
};

const connectToAvailableReceiver = async () => {
  if (serialPort?.isOpen) {
    return;
  }
  if (Date.now() < nextOpenAllowedAt) {
    return;
  }

  const ports = await listPorts();
  const match = resolveTargetPort(ports);
  if (!match) {
    if (currentStatus.state !== 'disconnected') {
      setStatus({
        state: 'disconnected',
        message: 'Waiting for button receiver',
      });
    }
    return;
  }

  await openPortWithRetries(match.path, hadSuccessfulConnection);
};

const pollPorts = async () => {
  await runExclusive(async () => {
    const ports = await listPorts();

    if (serialPort?.isOpen && currentPath) {
      const stillPresent = ports.some((port) => port.path === currentPath);
      if (!stillPresent) {
        await closePortInternal();
        resetBackoff();
        setStatus({
          state: 'reconnecting',
          message: 'Button receiver disconnected',
        });
        await connectToAvailableReceiver();
      }
      return;
    }

    await connectToAvailableReceiver();
  });
};

const startWatching = () => {
  if (pollTimer) {
    return;
  }
  pollTimer = setInterval(() => {
    runInBackground(pollPorts());
  }, POLL_INTERVAL_MS);
  runInBackground(pollPorts());
};

const reconnectNow = async () => {
  resetBackoff();
  await runExclusive(async () => {
    await closePortInternal();
    const ports = await listPorts();
    const match = resolveTargetPort(ports);
    if (!match) {
      setStatus({
        state: 'disconnected',
        message: 'Button receiver not found',
      });
      return;
    }
    await openPortWithRetries(match.path, hadSuccessfulConnection);
  });
};

const registerIpcHandlers = () => {
  if (ipcRegistered) {
    return;
  }
  ipcRegistered = true;

  ipcMain.on('getPortsList', async (event) => {
    const ports = await listPorts();
    event.reply('getPortsListResponse', ports);
  });

  ipcMain.on('getSerialPortStatus', (event) => {
    event.reply('serialPortStatus', currentStatus);
  });

  ipcMain.on('selectSerialPort', async (_event, portData) => {
    const path = extractPortPath(portData);
    if (!path) {
      const message = 'No serial port path provided';
      sendToRenderer('serialPortError', message);
      setStatus({
        state: 'error',
        message,
      });
      return;
    }

    preferredPath = path;
    resetBackoff();
    await runExclusive(async () => {
      await openPortWithRetries(path, hadSuccessfulConnection);
    });
  });

  ipcMain.on('reconnectSerialPort', () => {
    runInBackground(reconnectNow());
  });

  startWatching();
};

export const setSerialPortTargetWindow = (window: BrowserWindow) => {
  targetWindow = window;
  window.webContents.on('did-finish-load', () => {
    sendToRenderer('serialPortStatus', currentStatus);
  });
  sendToRenderer('serialPortStatus', currentStatus);

  window.on('closed', () => {
    if (targetWindow === window) {
      targetWindow = null;
    }
  });
};

const serialPortListener = (mainWindow: BrowserWindow) => {
  registerIpcHandlers();
  setSerialPortTargetWindow(mainWindow);

  return () => {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    runInBackground(closePortInternal());
  };
};

export default serialPortListener;
