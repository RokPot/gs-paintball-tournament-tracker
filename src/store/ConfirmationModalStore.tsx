import { create } from 'zustand';

interface ConfirmationStoreState {
  title: string;
  confirmButtonText: string;

  denyButtonText: string;

  Confirmation: string | (() => JSX.Element);

  buttonsFlexSpacing:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';

  onConfirm: Function;

  onClose: Function;

  loading: boolean;

  hideDeny: boolean;

  hideButtons: boolean;

  hideTitle: boolean;
}

const defaultValues: ConfirmationStoreState = {
  Confirmation: '',
  onConfirm: () => {},
  onClose: () => {},
  title: 'Confirmation required',
  confirmButtonText: 'Yes',
  denyButtonText: 'No',
  hideDeny: false,
  buttonsFlexSpacing: 'flex-end',
  hideButtons: false,
  hideTitle: false,
  loading: false,
};

const useConfirmationModalStore = create<
  ConfirmationStoreState & {
    containerClose: () => Promise<void>;

    containerConfirm: () => Promise<void>;

    openModal: (config: Partial<ConfirmationStoreState>) => void;
    closeModal: () => void;
  }
>((set, get) => ({
  Confirmation: defaultValues.Confirmation,
  confirmButtonText: defaultValues.confirmButtonText,
  denyButtonText: defaultValues.denyButtonText,
  title: defaultValues.title,
  onConfirm: defaultValues.onConfirm,
  onClose: defaultValues.onClose,
  loading: defaultValues.loading,
  buttonsFlexSpacing: defaultValues.buttonsFlexSpacing,
  hideButtons: defaultValues.hideButtons,
  hideDeny: defaultValues.hideDeny,
  hideTitle: defaultValues.hideTitle,
  containerClose: async () => {
    set(() => ({ loading: true }));
    if (get().onClose) {
      await get().onClose();
    }
    set(() => ({ loading: false }));
    get().closeModal();
  },
  containerConfirm: async () => {
    set(() => ({ loading: true }));
    if (get().onConfirm) {
      await get().onConfirm();
    }
    set(() => ({ loading: false }));
    get().closeModal();
  },
  openModal: (config) =>
    set(() => {
      return { ...config };
    }),
  closeModal: () =>
    set((state) => ({
      ...state,
      Confirmation: undefined,
      onConfirm: undefined,
      onClose: undefined,
      title: 'Confirm action',
    })),
}));

export default useConfirmationModalStore;
