export type Validator<T> = (input: T) => boolean;

/**
 * Validate string variable
 * (isn't really necessary with type-safe variables that are created from the FE application, but can happen with values are from API response)
 * @param {string} input: input value
 * @returns {boolean} determine if input is a string
 */
export function stringValidator(input: string): boolean {
  return typeof input === 'string';
}

/**
 * Validate email variable
 * @param {string} input: input value
 * @returns {boolean} determine if input is a valid email
 */
export function emailValidator(input: string): boolean {
  return stringValidator(input) && (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).test(input);
}

const MIN_PASSWORD_LENGTH = 8;
const EMPTY_INPUT_LENGTH = 0;

/**
 * Validate password variable
 * @param {string} input: input value
 * @returns {boolean} determine if input is a valid password
 */
export function passwordValidator(input: string): boolean {
  return stringValidator(input) && input.length > MIN_PASSWORD_LENGTH;
}

/**
 * Validate required field input
 * @param {string} input: input value from text field
 * @returns {boolean} determine if input is a valid password
 */
export function requiredFieldValidator(input: string): boolean {
  return stringValidator(input) && input.length > EMPTY_INPUT_LENGTH;
}

/**
 * Validate string variable
 * (isn't really necessary with type-safe variables that are created from the FE application, but can happen with values are from API response)
 * @param {string} input: input value
 * @returns {boolean} determine if input is a string
 */
export function numberValidator(input: number): boolean {
  return typeof input === 'number';
}
