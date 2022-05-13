import { emailValidator, numberValidator, passwordValidator, stringValidator, Validator } from '../utils/validators';
import { FormFieldError } from './errors';

export type FormField<T> = {
  dirty: boolean;
  error: FormFieldError;
  value: T;
};

/**
 * Create string form field
 * @param {string} initialValue: initial value
 * @param {string} validator: validator function
 * @returns {FormField}
 */
export function createStringFormField(initialValue: string = '', validator: Validator<string> = stringValidator): FormField<string> {
  return {
    dirty: false,
    error: {
      isError: false,
    },
    value: initialValue,
  };
}

/**
 * Create string form field
 * @param {number} initialValue: initial value
 * @param {number} validator: validator function
 * @returns {FormField}
 */
export function createNumberFormField(initialValue: number, validator: Validator<number> = numberValidator): FormField<number> {
  return {
    dirty: false,
    error: {
      isError: false,
    },
    value: initialValue,
  };
}

/**
 * Create email form field
 * @param {string} initialValue: initial value
 * @param {string} validator: validator function
 * @returns {FormField}
 */
export function createEmailFormField(initialValue: string = ''): FormField<string> {
  return createStringFormField(initialValue, emailValidator);
}

/**
 * Create password form field
 * @param {string} initialValue: initial value
 * @param {string} validator: validator function
 * @returns {FormField}
 */
export function createPasswordFormField(initialValue: string = ''): FormField<string> {
  return createStringFormField(initialValue, passwordValidator);
}
