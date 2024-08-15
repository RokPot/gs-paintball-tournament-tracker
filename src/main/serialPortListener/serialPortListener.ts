import { ReadlineParser } from '@serialport/parser-readline';
import { BrowserWindow, ipcMain } from 'electron';
import { SerialPort } from 'serialport';

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

export declare interface PortInfo {
  path: string;
  manufacturer: string | undefined;
  serialNumber: string | undefined;
  pnpId: string | undefined;
  locationId: string | undefined;
  productId: string | undefined;
  vendorId: string | undefined;
}
// let mainWindow: BrowserWindow | null = null;

const serialPortListener = (mainWindow: BrowserWindow) => {
  let serialPort: SerialPort | null = null;
  let SerialReadlineParser: ReadlineParser | null = null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  ipcMain.on('getPortsList', async (event) => {
    const ports = await SerialPort.list();
    console.log('poooorts', ports);
    event.reply('getPortsListResponse', ports);
  });
  ipcMain.on('selectSerialPort', async (event) => {
    try {
      if (serialPort) {
        serialPort.removeAllListeners();
        if (serialPort.isOpen) {
          serialPort.close();
        }
        SerialReadlineParser?.removeAllListeners();
      }
      serialPort = new SerialPort(
        {
          baudRate: 115200,
          path: 'COM3',
        },
        (e) => {
          event.reply('serialPortError', e);
        },
      );

      SerialReadlineParser = serialPort.pipe(
        new ReadlineParser({ delimiter: 'R' }),
      );
      SerialReadlineParser.addListener('data', (data) => {
        if (data === 'cp: 1') {
          mainWindow.webContents.send('buttonsResponse', 'Team1Button');
        } else if (data === 'cp: 2') {
          mainWindow.webContents.send('buttonsResponse', 'Team2Button');
        }
      });
    } catch (e) {
      console.error(e);
    }
  });

  return () => {
    if (serialPort) {
      serialPort.removeAllListeners();
      if (serialPort.isOpen) {
        serialPort.close();
      }
    }
  };
};

export default serialPortListener;
