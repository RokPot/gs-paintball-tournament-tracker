import useIPCRendererMessages, {
  PortInfo,
} from 'hooks/main/useIPCRendererMessages';
import { useCallback, useEffect, useState } from 'react';

const useSerialButton = () => {
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

  const onButtonsResponse = useCallback((result: any) => {
    console.log(result);
  }, []);

  useEffect(() => {
    listenToButtonsResponse(onButtonsResponse);
  }, []);

  return {
    getAvailablePorts,
    selectReceiverPort,
    availablePorts,
  };
};

export default useSerialButton;
