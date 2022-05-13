import './company-information.scss';

import { useEffect, useMemo } from 'react';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';

import { Firebase } from '../../../global/models/firebase';

interface Props {
  firebase: Firebase;
  companyId: string;
  onInit: () => void;
}

/**
 * Company - CompanyInformation component
 * @returns {JSX.Element}
 */
function CompanyInformation({ firebase, companyId, onInit }: Props): JSX.Element {
  const [value, loading, error] = useDocumentOnce(
    firebase.firestore().doc(`companies/${companyId}`),
  );

  const companyObj = useMemo(() => value?.data(), [value]);

  useEffect(() => {
    if (!loading) {
      onInit();
    }
  }, [loading, onInit]);

  return loading ? (
    <>
      Loading...
    </>
  ) : (
    <>
      {error ? `${error}` : null}
      {companyObj ? (
        <div>
          <p className="company-name">
            {companyObj.name}
          </p>

          <p className="company-address">
            {companyObj.address}
          </p>

        </div>
      ) : null}
    </>
  );
}

export default CompanyInformation;
