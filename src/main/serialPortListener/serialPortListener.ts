import { ReadlineParser } from '@serialport/parser-readline';
import { BrowserWindow, ipcMain } from 'electron';
import { SerialPort } from 'serialport';

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
  ipcMain.on('get-ports-list', async (event) => {
    const ports = await SerialPort.list();
    console.log('ports', ports);

    event.reply('get-ports-list-response', ports);
  });
  ipcMain.on('select-serial-port', async (event, arg: PortInfo) => {
    console.log(event, arg);
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
          console.log(e);
          event.reply('serialPortError', e);
        },
      );

      SerialReadlineParser = serialPort.pipe(
        new ReadlineParser({ delimiter: 'R' }),
      );
      SerialReadlineParser.addListener('data', (data) => {
        if (data === 'cp: 1') {
          console.log('eee1', data);
          mainWindow.webContents.send('buttons-response', 'Team1Button');
        } else if (data === 'cp: 2') {
          console.log('eee2', data);
          mainWindow.webContents.send('buttons-response', 'Team2Button');
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
