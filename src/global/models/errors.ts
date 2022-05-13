export type FormFieldError = {
  isError: false;
} | {
  isError: true;
  message: string;
};
