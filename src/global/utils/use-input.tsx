import { ChangeEvent, FocusEventHandler, FormEvent, useReducer } from 'react';

import { CR_OFF, CR_ON } from './global-settings';

interface InputState {
  value: string,
  isTouched: boolean,
  dateValue: Date,
}

const initialInputState = {
  value: '',
  isTouched: false,
  dateValue: new Date(),
};

type InputAction = {
  type: 'INPUT';
  payload: string;
} | {
  type: 'BLUR';
} | {
  type: 'RESET';
} | {
  type: 'INPUT_DATE';
  payload: Date;
}

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

/**
 * Reducer
 * @param {InputState} state of the input form.
 * @param {InputAction} action of the user.
 * @returns {state} next state
 */
function inputStateReducer(state: InputState, action: InputAction) {
  switch (action.type) {
    case 'INPUT': {
      return {
        ...state,
        value: action.payload,
        isTouched: state.isTouched,
        dateValue: state.dateValue,
      };
    }

    case 'INPUT_DATE': {
      return {
        ...state,
        value: state.value,
        isTouched: state.isTouched,
        dateValue: action.payload,
      };
    }

    case 'BLUR': {
      return {
        value: state.value,
        isTouched: true,
        dateValue: state.dateValue,
      };
    }

    case 'RESET': {
      return {
        value: '',
        isTouched: false,
        dateValue: new Date(),
      };
    }

    default:
      return state;
  }
}

/**
 * NewClientForm
 * @param {()} validateValue: Higher order function
 * @returns {JSX.Element}
 */
function useInput(validateValue: any) {
  const [inputState, dispatch] = useReducer(inputStateReducer, initialInputState);

  const valueIsValid = validateValue(inputState.value);
  const hasError = !valueIsValid && inputState.isTouched;

  /**
   * Handler input change
   * @param {ChangeEvent} event input from user
   */
  function valueChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: 'INPUT', payload: event.target.value });
  }

  /**
   * Handler input change
   * @param {string} initialValue input from user
   */
  function valueInitHandler(initialValue: string) {
    dispatch({ type: 'INPUT', payload: initialValue });
  }

  /**
   * Handler input change
   * @param {FormEvent} event select from user
   */
  function valueSelectHandler(event: FormEvent<HTMLSelectElement>) {
    dispatch({ type: 'INPUT', payload: event.currentTarget.value });
  }

  /**
   * Handler input change
   * @param {FormEvent} event select from user
   */
  function valueCheckHandler(event: FormEvent<HTMLInputElement>) {
    const target = event.currentTarget;
    let checkboxValue = '';

    if (target.type === 'checkbox') {
      checkboxValue = target.checked ? CR_ON : CR_OFF;
    }

    dispatch({ type: 'INPUT', payload: checkboxValue });
  }

  /**
   * Handler input change
   * @param {Date} dateValue input from user
   */
  function valueDateHandler(dateValue: Date) {
    dispatch({ type: 'INPUT_DATE', payload: dateValue });
  }

  /**
   * Handler input got blur
   */
  function inputBlurHandler() {
    dispatch({ type: 'BLUR' });
  }

  /**
   * Handler input got focus
   * @param {FormEvent} event select from user
   */
  function inputFocusHandler(event: FormEvent<FocusEventHandler>) {
    dispatch({ type: 'BLUR' });
  }

  /**
   * Handler reset the input control
   */
  function reset() {
    dispatch({ type: 'RESET' });
  }

  return {
    dateValue: inputState.dateValue,
    hasError,
    isValid: valueIsValid,
    value: inputState.value,
    inputBlurHandler,
    inputFocusHandler,
    reset,
    valueChangeHandler,
    valueDateHandler,
    valueInitHandler,
    valueSelectHandler,
    valueCheckHandler,
  };
}

export default useInput;
