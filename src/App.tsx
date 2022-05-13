import './App.scss';
import './global/common.scss';

import { FirebaseAuthProvider, IfFirebaseAuthed, IfFirebaseUnAuthed } from '@react-firebase/auth';
import firebase from 'firebase';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import FIREBASE_CONFIG from './firebase-config';
import Header from './global/components/header/header';
import CompanyContextProvider from './global/utils/company-context';
import ModalContextProvider from './global/utils/modal-context';
import UserContextProvider from './global/utils/user-context';
import Login from './pages/auth/login/login';
import ClientList from './pages/client/client-list/client-list';
import InvoicePrint from './pages/project/invoice-print/invoice-print';
import ProjectDetail from './pages/project/project-detail/project-detail';
import ProjectList from './pages/project/project-list/project-list';
import ReportSummary from './pages/reports/report-summary/report-summary';
import StyleGuidelines from './style-guidelines/style-guidelines';

/**
 * Global App component
 * @returns {JSX.Element}
 */
function App(): JSX.Element {
  return (
    <HashRouter basename="/">
      <Route path="/style-guidelines" component={StyleGuidelines} />
      <FirebaseAuthProvider
        apiKey={FIREBASE_CONFIG.apiKey}
        projectId={FIREBASE_CONFIG.projectId}
        databaseURL={FIREBASE_CONFIG.databaseURL}
        authDomain={FIREBASE_CONFIG.authDomain}
        storageBucket={FIREBASE_CONFIG.storageBucket}
        messagingSenderId={FIREBASE_CONFIG.messagingSenderId}
        firebase={firebase}
      >
        <ModalContextProvider>
          <UserContextProvider>
            <CompanyContextProvider>
              <>
                <IfFirebaseAuthed>
                  {() => (
                    <>
                      <Header firebase={firebase} />
                      <Route exact path="/client/list" component={() => <ClientList firebase={firebase} />} />
                      <Route exact path="/project/list" component={() => <ProjectList firebase={firebase} />} />
                      <Route exact path="/report" component={() => <ReportSummary firebase={firebase} />} />
                      <Switch>
                        <Route exact path="/project/detail/:projectId">
                          <ProjectDetail firebase={firebase} />
                        </Route>
                        <Route exact path="/invoice/print/:projectId/:invoiceId">
                          <InvoicePrint firebase={firebase} />
                        </Route>
                      </Switch>
                      <Route exact path="/" render={() => <Redirect to="/project/list" />} />
                    </>
                  )}
                </IfFirebaseAuthed>
                <IfFirebaseUnAuthed>
                  {() => (
                    <>
                      <Route path="/login" component={() => <Login firebase={firebase} />} />
                      <Route path="/" component={() => <Login firebase={firebase} />} />
                    </>
                  )}
                </IfFirebaseUnAuthed>
              </>
            </CompanyContextProvider>
          </UserContextProvider>
        </ModalContextProvider>
      </FirebaseAuthProvider>
    </HashRouter>
  );
}

export default App;
