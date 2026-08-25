import {
  BUTTON_RECEIVER_NAME_HINT,
  BUTTON_RECEIVER_PRODUCT_ID,
  BUTTON_RECEIVER_VENDOR_ID,
  ButtonReceiverPort,
  findButtonReceiver,
  isButtonReceiver,
} from 'main/serialPortListener/buttonReceiverConfig';

const buildPort = (
  overrides: Partial<ButtonReceiverPort> & Pick<ButtonReceiverPort, 'path'>,
): ButtonReceiverPort => ({
  manufacturer: undefined,
  serialNumber: undefined,
  pnpId: undefined,
  locationId: undefined,
  productId: undefined,
  vendorId: undefined,
  friendlyName: undefined,
  ...overrides,
});

describe('isButtonReceiver', () => {
  it('matches Silicon Labs CP210x by vendor and product id, case-insensitive', () => {
    expect(
      isButtonReceiver(
        buildPort({
          path: 'COM7',
          vendorId: '10c4',
          productId: 'ea60',
        }),
      ),
    ).toBe(true);
  });

  it('matches a different Windows instance id via VID/PID, not only \\0001', () => {
    expect(
      isButtonReceiver(
        buildPort({
          path: 'COM12',
          vendorId: BUTTON_RECEIVER_VENDOR_ID,
          productId: BUTTON_RECEIVER_PRODUCT_ID,
          pnpId: 'USB\\VID_10C4&PID_EA60\\0002',
        }),
      ),
    ).toBe(true);
  });

  it('matches the name hint in friendlyName when VID/PID are missing', () => {
    expect(
      isButtonReceiver(
        buildPort({
          path: 'COM5',
          friendlyName: `${BUTTON_RECEIVER_NAME_HINT} USB to UART Bridge`,
        }),
      ),
    ).toBe(true);
  });

  it('matches the name hint in manufacturer', () => {
    expect(
      isButtonReceiver(
        buildPort({
          path: 'COM5',
          manufacturer: BUTTON_RECEIVER_NAME_HINT,
        }),
      ),
    ).toBe(true);
  });

  it('matches the name hint in pnpId', () => {
    expect(
      isButtonReceiver(
        buildPort({
          path: 'COM5',
          pnpId: `USB\\${BUTTON_RECEIVER_NAME_HINT}\\0001`,
        }),
      ),
    ).toBe(true);
  });

  it('rejects unrelated ports', () => {
    expect(
      isButtonReceiver(
        buildPort({
          path: 'COM3',
          vendorId: '0403',
          productId: '6001',
          friendlyName: 'USB Serial Port',
          manufacturer: 'FTDI',
        }),
      ),
    ).toBe(false);
  });

  it('does not match vendor id alone without product id or name hint', () => {
    expect(
      isButtonReceiver(
        buildPort({
          path: 'COM9',
          vendorId: BUTTON_RECEIVER_VENDOR_ID,
          productId: '0000',
        }),
      ),
    ).toBe(false);
  });
});

describe('findButtonReceiver', () => {
  const receiver = buildPort({
    path: 'COM7',
    vendorId: BUTTON_RECEIVER_VENDOR_ID,
    productId: BUTTON_RECEIVER_PRODUCT_ID,
  });
  const other = buildPort({
    path: 'COM3',
    vendorId: '0403',
    productId: '6001',
  });

  it('returns the first matching receiver', () => {
    expect(findButtonReceiver([other, receiver])).toEqual(receiver);
  });

  it('prefers the previously connected path when it still matches', () => {
    const secondReceiver = buildPort({
      path: 'COM8',
      vendorId: BUTTON_RECEIVER_VENDOR_ID,
      productId: BUTTON_RECEIVER_PRODUCT_ID,
    });

    expect(findButtonReceiver([receiver, secondReceiver], 'COM8')).toEqual(
      secondReceiver,
    );
  });

  it('returns undefined when no receiver is present', () => {
    expect(findButtonReceiver([other])).toBeUndefined();
  });
});
