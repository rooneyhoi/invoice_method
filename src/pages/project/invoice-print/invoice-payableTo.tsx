import './invoice-payableTo.scss';

import { useMemo } from 'react';
import Table from 'react-bootstrap/Table';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';

import { Firebase } from '../../../global/models/firebase';

interface Props {
  firebase: Firebase;
  bankId: string;
}

/**
 * Invoice - InvoicePayableTo component
 * @returns {JSX.Element}
 */
function InvoicePayableTo({ firebase, bankId }: Props): JSX.Element {
  const [value, loading, error] = useDocumentOnce(
    firebase.firestore().doc(`banks/${bankId}`),
  );

  const bankObj = useMemo(() => value?.data(), [value]);

  return loading ? (
    <>
      Loading...
    </>
  ) : (
    <>
      {error ? `${error}` : null}
      {bankObj ? (
        <div>
          <h3>Payable To:</h3>
          <Table borderless responsive="sm" size="sm" className="info-table">
            <tbody>
              <tr>
                <td className="label-column">Company Name:</td>
                <td>{bankObj.payableTo}</td>
              </tr>

              <tr>
                <td className="label-column">Account Number:</td>
                <td>{bankObj.accountNumber}</td>
              </tr>

              <tr>
                <td className="label-column">Bank Name:</td>
                <td>{bankObj.bankName}</td>
              </tr>

              <tr>
                <td className="label-column">Bank Address:</td>
                <td>{bankObj.bankAddress}</td>
              </tr>

              <tr>
                <td className="label-column">Swift/IBAN:</td>
                <td>{bankObj.IBAN}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      ) : null}
    </>
  );
}

export default InvoicePayableTo;
