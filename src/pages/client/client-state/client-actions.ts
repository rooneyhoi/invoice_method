export type ClientActions = {
  type: 'UPDATE_CLIENT_ABBREVIATION';
  abbreviation: string;
} | {
  type: 'UPDATE_CLIENT_ADDRESS';
  address: string;
} | {
  type: 'UPDATE_CLIENT_CC_EMAIL';
  ccEmail: string;
} | {
  type: 'UPDATE_CLIENT_CITY';
  city: string;
} | {
  type: 'UPDATE_CLIENT_COUNTRY';
  country: string;
} | {
  type: 'UPDATE_CLIENT_CURRENCY';
  currency: string;
} | {
  type: 'UPDATE_CLIENT_CURRENCY_ACCOUNT';
  currencyAccount: string;
} | {
  type: 'UPDATE_CLIENT_CURRENT_STATUS';
  currentStatus: string;
} | {
  type: 'UPDATE_CLIENT_HOUR_RATE';
  hourRate: number;
} | {
  type: 'UPDATE_CLIENT_INVOICE_EMAIL';
  invoiceEmail: string;
} | {
  type: 'UPDATE_CLIENT_LEGAL_NAME';
  legalName: string;
} | {
  type: 'UPDATE_CLIENT_NAME';
  name: string;
} | {
  type: 'UPDATE_CLIENT_PAYABLE_TO';
  payableTo: string;
} | {
  type: 'UPDATE_CLIENT_REPRESENTATIVE_NAME';
  representativeName: string;
} | {
  type: 'UPDATE_CLIENT_STATE';
  state: string;
} | {
  type: 'UPDATE_CLIENT_TAX_RATE';
  taxRate: number;
} | {
  type: 'UPDATE_CLIENT_TELEPHONE';
  telephone: string;
} | {
  type: 'UPDATE_CLIENT_ZIP_CODE';
  zipCode: string;
} | {
  type: 'ADD_NEW_CLIENT';
  successCallback: () => void;
};

/**
 * Check empty input value
 * @param {string} value: input value
 * @returns {boolean}
 */
export function isNotEmpty(value: string) {
  return value.trim() !== '';
}

/**
 * Check empty input value
 * @param {string} value: input value
 * @returns {boolean}
 */
export function isEmail(value: string) {
  return value.includes('@');
}

/**
 * Check empty input value
 * @param {string} value: input value
 * @returns {boolean}
 */
export function isNumber(value: string) {
  const inputNumber = Number(value);
  return isNaN(inputNumber);
}
