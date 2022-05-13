export type CurrencyFormat = 'USD' | 'EUR' | 'AUD' | 'VND';

const ROUND_ONE_NUMBER = 1;
const MULTIPLY_SECONDS = 1000;
const DIVIDE_NANOSECONDS = 1000000;

/**
 * Validate password variable
 * @param {string} input: input value
 * @returns {string} reformat the string to number style
 */
export function formatStringAsNumber(input: string | number): string {
  const convertNumber = Number(input);
  return Number(convertNumber.toFixed(ROUND_ONE_NUMBER)).toLocaleString();
}

/**
 * Validate password variable
 * @param {string} input: input value
 * @param {CurrencyFormat} currencyFormat: input value
 * @returns {string} reformat the string to number style
 */
export function formatStringAsCurrency(input: string, currencyFormat: CurrencyFormat): string {
  const convertNumber = Number(input);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyFormat,
  });

  return formatter.format(convertNumber);
}

/**
 * timestampToDate
 * @param {number} seconds input
 * @param {number} nanoseconds input
 * @returns {string} the converted date value
 */
function timestampToDate(seconds: number, nanoseconds: number): string {
  const fireBaseTime: Date = new Date(
    seconds * MULTIPLY_SECONDS + nanoseconds / DIVIDE_NANOSECONDS,
  );

  return fireBaseTime.toLocaleDateString();
}

/**
 * parseFirebaseTime
 * @param {Date} firebaseTime input
 * @returns {string} the converted date value
 */
export function convertFirebaseTime(firebaseTime: Date): string {
  const schedule: any = firebaseTime.toJSON();
  const seconds = Number(schedule.seconds);
  const nanoseconds = Number(schedule.nanoseconds);

  return timestampToDate(seconds, nanoseconds);
}
