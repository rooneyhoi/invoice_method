import { CompanyDTO } from './company-dto';

export type ProjectStatus = 'Active - In Production' | 'B - In Sale' | 'C - Closed' | 'D - Deleted or Lost';

export interface ProjectDTO {
  currencyAccount: string;
  budget: number;
  currency: string;
  clientId: string;
  clientName?: string;
  currentStatus: ProjectStatus;
  deliveryDate: string;
  estimationURL: string;
  id: string;
  projectName: string;
  payableTo: CompanyDTO;
  PONumber: string;
  startDate: string;
  isTaxable: boolean;
}
