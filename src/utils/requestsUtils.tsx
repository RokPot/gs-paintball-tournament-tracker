export const processError = (e: unknown) => {
  let errorMessage = '';
  if (typeof e === 'string') {
    errorMessage = e.toUpperCase(); // works, `e` narrowed to string
  }
  if (e instanceof Error) {
    errorMessage = e.message; // works, `e` narrowed to Error
  }
  console.error(errorMessage);
};

export const processSuccess = (message: string) => {
  return message;
};
