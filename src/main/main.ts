/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import serialPortListener from './serialPortListener/serialPortListener';

export type Channels =
  | 'ipc-example'
  | 'ipc-example-response'
  | 'openNewWindow'
  | 'getPortsList'
  | 'setSelectedPort'
  | 'getPortsListResponse'
  | 'selectSerialPort'
  | 'buttonsResponse'
  | 'serialPortError'
  | 'gameSwitched'
  | 'gamesSwitched';

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

app
  .whenReady()
  .then(async () => {
    let window = await createWindow('main/index.html');
    serialPortListener(window);
    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) {
        window = await createWindow('main/index.html');
        serialPortListener(window);
      }
    });
  })
  .catch(console.log);

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
