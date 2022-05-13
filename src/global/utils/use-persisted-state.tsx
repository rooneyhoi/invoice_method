import { useEffect, useState } from 'react';

/**
 * usePersistedState
 * @param {string} key: represent local storage key
 * @param {string} defaultValue: default state value
 * @returns {Array} useState pair values
 */
function usePersistedState(key: string, defaultValue: string) {
  const [state, setState] = useState(() => {
    const persistedState = localStorage.getItem(key);
    return persistedState ? JSON.parse(persistedState) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
}

export default usePersistedState;
