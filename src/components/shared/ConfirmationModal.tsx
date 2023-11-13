import CustomModal from './CustomModal';
import FlexContainer from './FlexContainer';
import { Button, Typography } from '@mui/material';
import { isString } from 'lodash';
import { FunctionComponent } from 'react';
import useConfirmationModalStore from 'store/ConfirmationModalStore';

const preventPropagationAndPreventDefault = (event: any) => {
  try {
    event.preventDefault();
    event.nativeEvent?.stopImmediatePropagation();
  } catch {}
};

const ConfirmationModal: FunctionComponent<any> = (props) => {
  const { Confirmation, ...confirmationModalStore } =
    useConfirmationModalStore();

  const close = (e: any) => {
    preventPropagationAndPreventDefault(e);
    confirmationModalStore.containerClose();
  };

  const confirm = (e: any) => {
    preventPropagationAndPreventDefault(e);
    confirmationModalStore.containerConfirm();
  };

  return (
    <CustomModal
      isModalOpen={!!Confirmation}
      onClose={confirmationModalStore.containerClose}
      width={580}
    >
      <FlexContainer flexDirection="column" padding="24px">
        {confirmationModalStore.title && (
          <Typography
            variant="h3Medium"
            style={{
              width: '100%',
            }}
          >
            {confirmationModalStore.title}
          </Typography>
        )}
        {isString(Confirmation) || !Confirmation ? (
          <Typography variant="body1" style={{ width: '100%' }}>
            {Confirmation}
          </Typography>
        ) : (
          <div
            style={{
              margin: !confirmationModalStore.hideButtons
                ? '20px 0px 0px'
                : '20px 0px 40px 0px',
              width: '100%',
            }}
          >
            <Confirmation />
          </div>
        )}
        {!confirmationModalStore.hideButtons && (
          <FlexContainer
            justifyContent={confirmationModalStore.buttonsFlexSpacing}
            margin={30}
            style={{ marginTop: '40px', width: '100%' }}
          >
            {!confirmationModalStore.hideDeny && (
              <Button onClick={close} variant="outlined">
                <Typography variant="p1">
                  {confirmationModalStore.denyButtonText}
                </Typography>
              </Button>
            )}
            <Button
              onClick={confirm}
              disabled={confirmationModalStore.loading}
              variant="contained"
            >
              <Typography variant="p1">
                {confirmationModalStore.confirmButtonText}
              </Typography>
            </Button>
          </FlexContainer>
        )}
      </FlexContainer>
    </CustomModal>
  );
};

ConfirmationModal.defaultProps = {};

export default ConfirmationModal;
