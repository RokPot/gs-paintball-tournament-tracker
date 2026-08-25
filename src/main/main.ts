/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';

import log from 'electron-log/main';
import MenuBuilder from './menu';
import serialPortListener from './serialPortListener/serialPortListener';
import { resolveHtmlPath } from './util';

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
  | 'gamesSwitched'
  | 'timerUpdate'
  | 'resultsSnapshot'
  | 'requestResultsSnapshot';

let mainWindow: BrowserWindow | null = null;
const resultsWindows: BrowserWindow[] = [];

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async (windowPath: string) => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    parent: undefined,
    show: false,
    icon: getAssetPath('icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  mainWindow.maximize();
  mainWindow.loadURL(resolveHtmlPath(windowPath));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
  return mainWindow;
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

log.initialize();

log.transports.file.resolvePathFn = () =>
  path.join('', 'D:/Projects/gs-paintball-tournament-tracker/logs/mainLog.log');

app
  .whenReady()
  .then(async () => {
    const window = await createWindow('main/index.html');
    serialPortListener(window);
    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) {
        const recreatedWindow = await createWindow('main/index.html');
        serialPortListener(recreatedWindow);
      }
    });
  })
  .catch((e) => {
    console.error('Something went wrong', e);
    log.error(e);
  });

ipcMain.on('openNewWindow', async () => {
  resultsWindows.push(await createWindow('results/index.html'));
});

ipcMain.on('gameSwitched', async (event) => {
  try {
    event.reply('gamesSwitched', {});
    resultsWindows.forEach((resultsWindow) =>
      resultsWindow.webContents.send('gamesSwitched'),
    );
  } catch (e) {
    console.error(e);
  }
});

ipcMain.on('timerUpdate', async (event, timerData) => {
  try {
    // Broadcast timer update to all windows
    if (mainWindow) {
      mainWindow.webContents.send('timerUpdate', timerData);
    }
    resultsWindows.forEach((resultsWindow) =>
      resultsWindow.webContents.send('timerUpdate', timerData),
    );
  } catch (e) {
    console.error('Error broadcasting timer update:', e);
  }
});

/**
 * `createWindow` reassigns `mainWindow` for every window it opens, so there is
 * no reliable handle on the operator window here. Relaying to every other
 * window instead keeps this correct regardless of open order: only the
 * operator listens for requests, and only results windows listen for
 * snapshots.
 */
const relayToOtherWindows = (
  senderId: number,
  channel: Channels,
  payload?: unknown,
) => {
  BrowserWindow.getAllWindows().forEach((browserWindow) => {
    if (browserWindow.isDestroyed()) {
      return;
    }
    if (browserWindow.webContents.id === senderId) {
      return;
    }
    browserWindow.webContents.send(channel, payload);
  });
};

ipcMain.on('resultsSnapshot', async (event, snapshot) => {
  try {
    relayToOtherWindows(event.sender.id, 'resultsSnapshot', snapshot);
  } catch (e) {
    console.error('Error broadcasting results snapshot:', e);
  }
});

ipcMain.on('requestResultsSnapshot', async (event) => {
  try {
    relayToOtherWindows(event.sender.id, 'requestResultsSnapshot');
  } catch (e) {
    console.error('Error requesting results snapshot:', e);
  }
});
