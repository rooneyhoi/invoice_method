// Default currency list to use in Project, Client form
export const CurrencyList = [
  { currencyAcronym: 'USD', currencyName: 'US Dollar' },
  { currencyAcronym: 'AUD', currencyName: 'Australian Dollar' },
  { currencyAcronym: 'SGD', currencyName: 'Singapore Dollar' },
  { currencyAcronym: 'EUR', currencyName: 'Euro' },
  { currencyAcronym: 'VND', currencyName: 'Vietnam Dong' },
  { currencyAcronym: 'AED', currencyName: 'UAE Dirham' },
];

// Default company ID is Adaptis GmbH
export const DEFAULT_COMPANY = [{ id: 'ADAPTIS000000000', name: 'Adaptis GmbH' }];
export const DEFAULT_COMPANY_ID_LIST = ['ADAPTIS000000000'];
export const DEFAULT_ID = 'ADAPTIS000000000';
export const DEFAULT_BLANK_INVOICE_ID = '';

// Default project summary list
export const DEFAULT_PROJECT_LIST = [{
  projectId: 'ADAPTIS000000000',
  projectName: '',
  clientId: '',
  clientName: '',
  budget: 0,
  netPayment: 0,
}];

// Default invoice summary list
export const DEFAULT_INVOICE_LIST = [{
  projectId: '',
  invoiceId: '',
  invoiceName: '',
  amount: 0,
  sendOn: '',
  paidAmount: 0,
  paidOn: '',
  invoiceNotes: '',
  invoiceStatus: '',
}];
