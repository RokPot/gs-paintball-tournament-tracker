export const BUTTON_RECEIVER_VENDOR_ID = '10C4';
export const BUTTON_RECEIVER_PRODUCT_ID = 'EA60';
/** Windows friendlyName / manufacturer hint. Update when you have the exact device string. */
export const BUTTON_RECEIVER_NAME_HINT = 'Silicon Labs CP210x';

export type ButtonReceiverPort = {
  path: string;
  manufacturer?: string | undefined;
  serialNumber?: string | undefined;
  pnpId?: string | undefined;
  locationId?: string | undefined;
  productId?: string | undefined;
  vendorId?: string | undefined;
  friendlyName?: string | undefined;
};

export type SerialConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

export type SerialPortStatus = {
  state: SerialConnectionState;
  portPath?: string;
  message?: string;
};

export const isButtonReceiver = (port: ButtonReceiverPort): boolean => {
  const vendorId = port.vendorId?.toUpperCase();
  const productId = port.productId?.toUpperCase();
  if (
    vendorId === BUTTON_RECEIVER_VENDOR_ID &&
    productId === BUTTON_RECEIVER_PRODUCT_ID
  ) {
    return true;
  }

  const haystack = `${port.friendlyName ?? ''} ${port.manufacturer ?? ''} ${
    port.pnpId ?? ''
  }`.toLowerCase();
  return haystack.includes(BUTTON_RECEIVER_NAME_HINT.toLowerCase());
};

export const findButtonReceiver = (
  ports: ButtonReceiverPort[],
  preferredPath?: string,
): ButtonReceiverPort | undefined => {
  if (preferredPath) {
    const preferred = ports.find((port) => port.path === preferredPath);
    if (preferred && isButtonReceiver(preferred)) {
      return preferred;
    }
  }

  return ports.find(isButtonReceiver);
};
