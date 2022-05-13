import './login.scss';

import { useCallback, useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Firebase } from '../../../global/models/firebase';
import { createEmailFormField, createPasswordFormField, FormField } from '../../../global/models/form-field';
import { UserContext } from '../../../global/utils/user-context';
import { emailValidator, passwordValidator } from '../../../global/utils/validators';

export interface Props {
  firebase: Firebase;
}

type Action = {
  type: 'UPDATE_EMAIL';
  email: string;
} | {
  type: 'UPDATE_PASSWORD';
  password: string;
} | {
  type: 'LOGIN_BY_EMAIL';
};

interface State {
  email: FormField<string>;
  password: FormField<string>;
  submitted: boolean;
}

/**
 * Create component's initial state
 * @returns {State} initial state
 */
function init(): State {
  return {
    email: createEmailFormField(''),
    password: createPasswordFormField(''),
    submitted: false,
  };
}

/**
 * Redux reducer
 * @param {State} state: previous state
 * @param {Action} action: action
 * @returns {State} next state
 */
function loginReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_EMAIL': {
      const { dirty } = state.email;
      const isEmailValid = dirty ? emailValidator(action.email) : true;
      return {
        ...state,
        email: {
          dirty: true,
          error: isEmailValid ?
            {
              isError: false,
            } :
            {
              isError: true,
              message: 'Please enter a valid email address',
            },
          value: action.email,
        },
      };
    }

    case 'UPDATE_PASSWORD': {
      const { dirty } = state.password;
      const isPasswordValid = dirty ? passwordValidator(action.password) : true;
      return {
        ...state,
        password: {
          dirty: true,
          error: isPasswordValid ?
            {
              isError: false,
            } :
            {
              isError: true,
              message: 'Password must be a least 8 characters',
            },
          value: action.password,
        },
      };
    }

    case 'LOGIN_BY_EMAIL':
      return {
        ...state,
        submitted: true,
      };

    default:
      return state;
  }
}

/**
 * Auth - Login component
 * @returns {JSX.Element}
 */
function Login({ firebase }: Props): JSX.Element {
  const [state, dispatch] = useReducer(loginReducer, init());
  const { addUserToContext } = useContext(UserContext);

  useEffect(() => {
    window.document.body.classList.add('with-login-background');

    return () => {
      window.document.body.classList.remove('with-login-background');
    };
  }, []);

  const signInWithEmailAndPassword = useCallback(() => {
    dispatch({ type: 'LOGIN_BY_EMAIL' });
    firebase.auth().signInWithEmailAndPassword(state.email.value, state.password.value)
      .then((userCredential) => {
        addUserToContext(userCredential.user?.email ? userCredential.user.email : '');
      });
  }, [addUserToContext, firebase, state.email.value, state.password.value]);

  return (
    <article className="login page-container">
      <div className="w-100 px-lg-5">
        <h1 className="mx-5">Login</h1>

        <Form className="m-5" onSubmit={signInWithEmailAndPassword}>
          <Form.Group className={`input-group ${state.email.error.isError ? 'border-danger' : 'mb-3'}`}>
            <Form.Label>Username</Form.Label>
            <Form.Control
              placeholder="Username"
              type="email"
              required
              onChange={(evt) => dispatch({
                type: 'UPDATE_EMAIL',
                email: evt.target.value,
              })}
              value={state.email.value}
            />
          </Form.Group>
          {state.email.error.isError ? <p className="text-danger mb-3">{state.email.error.message}</p> : null}

          <Form.Group className={`input-group ${state.password.error.isError ? 'border-danger' : 'mb-3'}`}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              placeholder="Password"
              type="password"
              required
              onChange={(evt) => dispatch({
                type: 'UPDATE_PASSWORD',
                password: evt.target.value,
              })}
              value={state.password.value}
            />
          </Form.Group>
          {state.password.error.isError ? <span className="text-danger mb-3">{state.password.error.message}</span> : null}

          <Button className="mt-3" size="lg" type="submit">Submit</Button>

          <Button
            className="mt-3 mx-3"
            onClick={() => {
              const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
              firebase.auth().signInWithPopup(googleAuthProvider);
            }}
            type="button"
          >
            Sign in with Google
          </Button>
        </Form>
      </div>
    </article>
  );
}

export default Login;
