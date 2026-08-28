export type ObservableResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};
