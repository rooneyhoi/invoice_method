import './client-information.scss';

import { useEffect, useMemo } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';

import { Firebase } from '../../../global/models/firebase';

interface Props {
  firebase: Firebase;
  clientId: string;
  onInit: () => void;
}

/**
 * Client - ClientInformation component
 * @returns {JSX.Element}
 */
function ClientInformation({ firebase, clientId, onInit }: Props): JSX.Element {
  const [value, loading, error] = useDocumentOnce(
    firebase.firestore().doc(`clients/${clientId}`),
  );

  const clientObj = useMemo(() => value?.data(), [value]);

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
      {clientObj ? (
        <div className="client-info-container">

          <p className="client-name">
            {clientObj.name}
          </p>

          <p className="client-attn">
            {`Attn: ${clientObj.representativeName}`}
          </p>

          <p className="client-info">
            {clientObj.address || ''}
          </p>

          <p className="client-info">
            {`${clientObj.city || ''} ${clientObj.state || ''} ${clientObj.zipCode || ''}`}
          </p>

          <p className="client-info">
            {clientObj.country}
          </p>

          <div className="client-contact">
            <Row>

              <Col xs="auto">
                <span>
                  {`T: ${clientObj.telephone}`}
                </span>
              </Col>

              <Col xs="auto">
                <span>
                  {`E: ${clientObj.invoiceEmail}`}
                </span>
              </Col>

            </Row>
          </div>

        </div>
      ) : null}
    </>
  );
}

export default ClientInformation;
