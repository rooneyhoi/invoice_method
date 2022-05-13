import { createContext, useState } from 'react';

interface Prop {
  children: JSX.Element;
}

interface ModalContextObj {
  isModalDisplayed: boolean;
  showModal(): void;
  hideModal(): void;
}

export const ModalContext = createContext<ModalContextObj>({
  isModalDisplayed: false,
  showModal: () => { },
  hideModal: () => { },
});

/**
 * ModalContextProvider
 * @param {Prop} prop input property
 * @returns {JSX.Element}
 */
export function ModalContextProvider({ children }: Prop) {
  const [isDisplayed, setIsDisplayed] = useState(false);

  /**
   * Show modal
   */
  function showModal(): void {
    setIsDisplayed(true);
  }

  /**
   * Hide modal
   */
  function hideModal(): void {
    setIsDisplayed(false);
  }

  const contextValue: ModalContextObj = {
    isModalDisplayed: isDisplayed,
    showModal,
    hideModal,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContextProvider;
