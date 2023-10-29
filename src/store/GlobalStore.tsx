import { create } from 'zustand';

interface GlobalStoreState {}

const useGlobalStore = create<GlobalStoreState>((set, get) => ({}));

export default useGlobalStore;
