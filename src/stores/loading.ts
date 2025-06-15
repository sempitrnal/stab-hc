// store/loading.ts
import { create } from "zustand";

interface LoadingStore {
  loading: boolean;
  setLoading: (val: boolean) => void;
}

const useGlobalLoadingStore = create<LoadingStore>((set) => ({
  loading: false,
  setLoading: (val) => set({ loading: val }),
}));

export default useGlobalLoadingStore;
