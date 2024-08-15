import useIPCRendererMessages, {
  PortInfo,
} from 'hooks/main/useIPCRendererMessages';
import { useCallback, useEffect, useState } from 'react';

const useSerialButton = (onButtonClicked: (data: any) => void) => {
  const [availablePorts, setAvailablePorts] = useState<PortInfo[]>([]);

  const {
    listenToButtonsResponse,
    sendGetReceiverPortsList,
    listenToGetReceiverPortsListResponse,
    sendReceiversSelectedSerialPort,
  } = useIPCRendererMessages();

  const getAvailablePorts = useCallback(() => {
    sendGetReceiverPortsList();
    listenToGetReceiverPortsListResponse((result) => {
      console.log(result);
      setAvailablePorts(result as unknown as PortInfo[]);
    });
  }, [listenToGetReceiverPortsListResponse, sendGetReceiverPortsList]);

  const selectReceiverPort = useCallback(
    (port: PortInfo) => {
      sendReceiversSelectedSerialPort(port);
    },
    [sendReceiversSelectedSerialPort],
  );

  const onButtonsResponse = useCallback(
    (result: any) => {
      console.log(result);
      onButtonClicked(result);
    },
    [onButtonClicked],
  );

  useEffect(() => {
    listenToButtonsResponse(onButtonsResponse);
    getAvailablePorts();
  }, []);

  return {
    getAvailablePorts,
    selectReceiverPort,
    availablePorts,
  };
};

export default useSerialButton;
