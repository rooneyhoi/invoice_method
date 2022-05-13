import { ClientStatus } from '../../utils/global-settings';

export interface ClientDTO {
  abbreviation: string;
  address: string;
  ccEmail: string;
  city: string;
  companyId: string;
  country: string;
  currency: string;
  currencyAccount: string;
  currentStatus: ClientStatus;
  hourRate: number;
  id: string;
  invoiceEmail: string;
  legalName: string;
  name: string;
  netPayment: number;
  parentCompanyId: string;
  payableTo: string;
  representativeName: string;
  state: string;
  taxRate: number;
  telephone: string;
  zipCode: string;
}
