import './client-list.scss';

import { useContext, useEffect, useMemo, useState } from 'react';
import { useCollectionOnce, useDocumentOnce } from 'react-firebase-hooks/firestore';

import { Firebase } from '../../../global/models/firebase';
import { CompanyContext } from '../../../global/utils/company-context';
import AddNewClient from '../client-create/client-create';
import ClientItem from '../client-item/client-item';

export interface Props {
  firebase: Firebase;
}

/**
 * Client - ClientList component
 * @returns {JSX.Element}
 */
function ClientList({ firebase }: Props): JSX.Element {
  const { companyId: selectedCompany } = useContext(CompanyContext);

  // Create a state to check the mount status
  const [didMount, setDidMount] = useState(false);

  const [clientValue, clientLoading, clientError] = useCollectionOnce(
    firebase.firestore().collection('clients').where('parentCompanyId', '==', selectedCompany),
  );

  const [companyValue, companyLoading, companyError] = useDocumentOnce(
    firebase.firestore().doc(`companies/${selectedCompany}`),
  );
  const companyObj = useMemo(() => companyValue?.data(), [companyValue]);

  // This is to make sure the component is unmounted when use change company and the router redirect to project list page
  // This way we are sure that if your component is unmounted we are not trying to fetch something.
  useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
  }, []);

  if (!didMount) {
    return <></>;
  }

  return clientLoading || companyLoading ? (
    <article className="client-list-page page-container">
      Loading...
    </article>
  ) : (
    <article className="client-list-page page-container">

      {companyError ? `${companyError}` : null}
      <div className="title-bar">
        <div>
          <p>VIEWING</p>
          <h2>{companyObj ? `${companyObj?.name} Clients` : 'Please select a company'}</h2>
        </div>
        <span>
          <AddNewClient firebase={firebase} currentCompanyId={selectedCompany} />
        </span>
      </div>

      {clientError ? `${clientError}` : null}
      {clientValue ? (
        <div>
          {
            clientValue.docs.map((clientDoc) => (
              <ClientItem
                abbreviation={clientDoc.data().abbreviation}
                id={clientDoc.id}
                key={clientDoc.id}
                legalName={clientDoc.data().legalName}
                name={clientDoc.data().name}
                firebase={firebase}
                currentCompanyId={selectedCompany}
              />
            ))
          }
        </div>
      ) : null}
    </article>
  );
}

export default ClientList;
