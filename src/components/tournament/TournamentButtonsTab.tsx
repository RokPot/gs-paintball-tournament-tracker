import { faA, faB, faSatelliteDish } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  lighten,
  Step,
  StepButton,
  Stepper,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { PortInfo } from 'hooks/main/useIPCRendererMessages';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ButtonsContext } from 'store/ButtonsContext';
import useBus from 'use-bus';

const StyledRootFieldContainer = styled('div')`
  position: relative;
`;

const StyledBordersContainer = styled('div')`
  width: 470px;
  height: 270px;
  position: absolute;
  top: 0px;
  border: 3px solid white;
  margin: 15px;
  border-radius: 5px;
  z-index: 2;
`;

const StyledTeamBase = styled('div')`
  height: 100px;
  width: 70px;
  position: absolute;
  top: 100px;
  right: 0px;
  border: 3px solid white;
  border-radius: 0px 50% 50% 0px;
`;

const StyledFieldContainer = styled('div')`
  width: 500px;
  height: 300px;
  background: ${({ theme }) => theme.palette.primary.light};
  display: flex;
  border-radius: 5px;

  div:nth-child(n) {
    width: 10%;
    background-color: ${({ theme }) =>
      lighten(theme.palette.success.main, 0.6)};
    height: 100%;
  }
  div:nth-child(2n) {
    width: 10%;
    background-color: ${({ theme }) =>
      lighten(theme.palette.success.main, 0.8)};
    height: 100%;
  }
`;

const Button2SignalConfirmation: React.FC<{ confirmed?: boolean }> = ({
  confirmed,
}) => {
  const theme = useTheme();
  return (
    <div
      style={{
        position: 'absolute',
        top: '137px',
        right: '63px',
      }}
    >
      <div
        style={{
          position: 'relative',
        }}
      >
        <FontAwesomeIcon
          fontSize={25}
          icon={faSatelliteDish}
          color={
            confirmed ? theme.palette.success.main : theme.palette.error.main
          }
          style={{
            position: 'absolute',
            transform: 'rotate(270deg)',
          }}
        />
        <FontAwesomeIcon
          fontSize={18}
          icon={faB}
          color={
            confirmed ? theme.palette.success.main : theme.palette.error.main
          }
          style={{
            position: 'absolute',
            top: '20px',
            right: '-35px',
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

const Button1SignalConfirmation: React.FC<{ confirmed?: boolean }> = ({
  confirmed,
}) => {
  const theme = useTheme();
  return (
    <div
      style={{
        position: 'absolute',
        top: '137px',
        left: '40px',
      }}
    >
      <div
        style={{
          position: 'relative',
        }}
      >
        <FontAwesomeIcon
          fontSize={25}
          icon={faSatelliteDish}
          color={
            confirmed ? theme.palette.success.main : theme.palette.error.main
          }
          style={{
            position: 'absolute',
          }}
        />
        <FontAwesomeIcon
          fontSize={18}
          icon={faA}
          color={
            confirmed ? theme.palette.success.main : theme.palette.error.main
          }
          style={{
            position: 'absolute',
            top: '20px',
            left: '-10px',
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

interface IProps {}

const TournamentButtonsTab: React.FC<IProps> = () => {
  const [activeStep, setActiveStep] = useState(0);

  const {
    setSelectedPort,
    setButtonState,
    buttonState,
    selectedPort,
    availablePorts,
    refreshAvailablePorts,
    selectReceiverPort,
  } = useContext(ButtonsContext);

  useBus(
    'ButtonClicked',
    ({ type, payload }) => {
      if (type !== 'ButtonClicked') {
        return;
      }
      if (payload === 'Team1Button') {
        setButtonState?.({
          button2HandshakeConfirmed:
            buttonState?.button2HandshakeConfirmed || false,
          button1HandshakeConfirmed: true,
        });
      }
      if (payload === 'Team2Button') {
        setButtonState?.({
          button1HandshakeConfirmed:
            buttonState?.button1HandshakeConfirmed || false,
          button2HandshakeConfirmed: true,
        });
      }
    },
    [setButtonState, buttonState],
  );

  const theme = useTheme();

  const onPortSelected = useCallback(
    (selectedUSBPort: PortInfo) => {
      selectReceiverPort?.(selectedUSBPort);
      setSelectedPort?.(selectedUSBPort);
      setActiveStep(1);
    },
    [selectReceiverPort, setSelectedPort],
  );

  useEffect(() => {
    refreshAvailablePorts?.();
  }, [refreshAvailablePorts]);

  useEffect(() => {
    if (!availablePorts?.length) {
      return;
    }
    const preselectedButton = availablePorts.find(
      (availablePort) => availablePort.pnpId === 'USB\\VID_10C4&PID_EA60\\0001',
    );
    if (!preselectedButton) {
      return;
    }
    if (selectedPort) {
      return;
    }
    onPortSelected(preselectedButton);
  }, [availablePorts, onPortSelected, selectedPort]);
  const steps = [
    'Select Button Reciever Port',
    'Confirm Buttons',
    'We`re ready to go!',
  ];

  const handleStep = (step: number) => {
    setActiveStep(step);
  };

  return (
    <FlexContainer
      flexDirection="column"
      style={{ flexGrow: 1 }}
      overflowY="auto"
    >
      {buttonState?.button1HandshakeConfirmed &&
        buttonState.button2HandshakeConfirmed && (
          <Typography variant="p3Medium" color={theme.palette.success.main}>
            Buttons are confirmed and ready for action!
          </Typography>
        )}
      <Stepper
        nonLinear
        activeStep={activeStep}
        style={{ padding: '25px 0px' }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton
              color="inherit"
              onClick={() => {
                if (index === 0) {
                  refreshAvailablePorts?.();
                }
                handleStep(index);
              }}
            >
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && (
        <>
          {availablePorts?.length === 0 && (
            <Typography variant="p1Medium">No ports detected.</Typography>
          )}
          {availablePorts?.map((availablePort) => (
            <Button
              onClick={() => onPortSelected(availablePort)}
              variant={
                selectedPort?.pnpId === availablePort.pnpId
                  ? 'contained'
                  : 'outlined'
              }
            >
              {availablePort.path} - {availablePort.friendlyName}
            </Button>
          ))}
        </>
      )}
      {activeStep > 0 && (
        <Typography variant="p1Medium">
          Selected Receiver Port: {selectedPort?.friendlyName}
        </Typography>
      )}
      {activeStep > 0 && (
        <StyledRootFieldContainer>
          <StyledFieldContainer>
            <div />
            <div />
            <div />
            <div />
            <div />

            <div />

            <div />
            <div />
            <div />
            <div />
            <div />
          </StyledFieldContainer>
          <StyledBordersContainer />
          <StyledTeamBase
            style={{
              right: '15px',
              borderRadius: '50% 0px   0px 50%',
            }}
          />

          <StyledTeamBase
            style={{
              left: '15px',
            }}
          />
          <div
            style={{
              border: '1px solid white',
              height: '270px',
              position: 'absolute',
              top: '15px',
              right: '50%',
              width: '1px',
            }}
          />
          <Button1SignalConfirmation
            confirmed={buttonState?.button1HandshakeConfirmed}
          />

          <Button2SignalConfirmation
            confirmed={buttonState?.button2HandshakeConfirmed}
          />
        </StyledRootFieldContainer>
      )}
    </FlexContainer>
  );
};

export default TournamentButtonsTab;
