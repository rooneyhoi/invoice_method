import { createContext } from 'react';

import { DEFAULT_ID } from '../models/dtos/default-dto';
import usePersistedState from './use-persisted-state';

interface Prop {
  children: JSX.Element;
}

interface UserContextObj {
  userId: string;
  addUserToContext(userEmailAsId: string): void;
}

export const UserContext = createContext<UserContextObj>({
  userId: '',
  addUserToContext: (userEmailAsId: string) => { },
});

/**
 * UserContextProvider
 * @param {Prop} prop input property
 * @returns {JSX.Element}
 */
export function UserContextProvider({ children }: Prop) {
  const [userId, setUserId] = usePersistedState('userId', DEFAULT_ID);

  /**
   * @param {string} userEmailAsId as input
   */
  function addUserToContext(userEmailAsId: string): void {
    setUserId(userEmailAsId);
  }

  const contextValue: UserContextObj = {
    userId,
    addUserToContext,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
