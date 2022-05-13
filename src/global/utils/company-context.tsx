import { createContext } from 'react';

import { DEFAULT_ID } from '../models/dtos/default-dto';
import usePersistedState from './use-persisted-state';

interface Prop {
  children: JSX.Element;
}

interface CompanyContextObj {
  companyId: string;
  addCompanyToContext(companyId: string): void;
}

export const CompanyContext = createContext<CompanyContextObj>({
  companyId: '',
  addCompanyToContext: (companyId: string) => { },
});

/**
 * CompanyContextProvider
 * @param {Prop} prop input property
 * @returns {JSX.Element}
 */
export function CompanyContextProvider({ children }: Prop) {
  const [companyId, setCompanyId] = usePersistedState('companyId', DEFAULT_ID);

  /**
   * @param {string} selectedCompanyId as input
   */
  function addCompanyToContext(selectedCompanyId: string): void {
    setCompanyId(selectedCompanyId);
  }

  const contextValue: CompanyContextObj = {
    companyId,
    addCompanyToContext,
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
}

export default CompanyContextProvider;
