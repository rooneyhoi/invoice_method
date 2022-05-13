export type InvoiceStatus = 'Draft' | 'Send' | 'Paid';

const ONE_NUMBERS = 1;
const TWO_NUMBERS = 10;
const THREE_NUMBERS = 100;
const ONE_NUMBER_INVOICE = '00';
const TWO_NUMBER_INVOICE = '0';
const MIN_RANDOM_NUMBER = 100000000;
const MAX_RANDOM_NUMBER = 900000000;
const INVOICE_SUB_STRING_START = 0;
const INVOICE_SUB_STRING_END = 12;

// Use template string instead of sum string vs number
// Simplify the comparison with 1 number
// Consider the naming that is understandable in multiple contexts! Do we really need the export?
// Consider the flow of writing code for the reader to read from Top to Down

/**
 * Generate the latest invoice base on current total invoice number
 * @param {string} totalInvoiceNumber: input value
 * @returns {string} the number of invoice like 002, 003...
 */
function createLatestNumber(totalInvoiceNumber: number): string {
  const aLatestInvoiceNumber = totalInvoiceNumber + ONE_NUMBERS;

  if (totalInvoiceNumber < TWO_NUMBERS) {
    return `${ONE_NUMBER_INVOICE}${aLatestInvoiceNumber}`;
  }

  if (totalInvoiceNumber >= TWO_NUMBERS && totalInvoiceNumber < THREE_NUMBERS) {
    return `${TWO_NUMBER_INVOICE}${aLatestInvoiceNumber}`;
  }

  return totalInvoiceNumber.toString();
}

/**
 * Generate the random 9 numbers to create invoice number
 * @returns {string} the random number of invoice like 648172530, 200002508...
 */
function createRandomNumber(): string {
  // This line can create over max number and NOT using the min/max in it own meaning
  const random = Math.floor(MIN_RANDOM_NUMBER + Math.random() * MAX_RANDOM_NUMBER);
  return random.toString();
  // ? Create an empty array with n characters, then random each character from 0...9
  // ? Consider to study and write unit test for this kind of functions
}

/**
 * Generate the latest invoice based on current total number of invoice
 * @param {string} clientAbbreviation: short name of client's company name
 * @param {number} totalInvoiceNumber: total of invoice created for that client
 * @returns {string} the number of invoice like KMP674407360001, CCL648172530001...
 */
export function createNewInvoiceNumber(clientAbbreviation: string, totalInvoiceNumber: number): string {
  const aRandomNumber = createRandomNumber();
  const aLatestInvoiceNumber = createLatestNumber(totalInvoiceNumber);

  // To make the meaning of the whole line of code, especially when someone try to read it.
  return `${clientAbbreviation}${aRandomNumber}${aLatestInvoiceNumber}`;
}

/**
 * Generate the latest invoice base on current total invoice number
 * @param {string} invoiceNumber: current invoice number format
 * @param {number} totalInvoiceNumber: total of invoice created for that client
 * @returns {string} the number of invoice like KMP674407360001, CCL648172530001...
 */
export function createLatestInvoiceNumber(invoiceNumber: string, totalInvoiceNumber: number): string {
  const existingInvoiceNumber = invoiceNumber.substr(INVOICE_SUB_STRING_START, INVOICE_SUB_STRING_END);
  const aLatestInvoiceNumber = createLatestNumber(totalInvoiceNumber);

  return `${existingInvoiceNumber}${aLatestInvoiceNumber}`;
}

/**
 * Generate the latest invoice base on current total invoice number
 * @param {string} clientAbbreviation: short name of client's company name
 * @param {number} totalInvoiceNumber: total of invoice created for that client
 * @param {string} invoiceFormat: current invoice format (to reuse the random number)
 * @returns {string} the number of invoice like KMP674407360001, CCL648172530001...
 */
export function generateInvoiceNumber(clientAbbreviation: string, totalInvoiceNumber: number, invoiceFormat: string): string {
  if (totalInvoiceNumber < ONE_NUMBERS) {
    return createNewInvoiceNumber(clientAbbreviation, totalInvoiceNumber);
  }

  return createLatestInvoiceNumber(invoiceFormat, totalInvoiceNumber);
}
