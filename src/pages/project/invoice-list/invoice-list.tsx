import './invoice-list.scss';

import { useCollection } from 'react-firebase-hooks/firestore';

import { Firebase } from '../../../global/models/firebase';
import AddNewInvoice from '../invoice-create/invoice-create';
import InvoiceItem from '../invoice-item/invoice-item';

export interface Props {
  firebase: Firebase;
  projectId: string;
}

const DEFAULT_INVOICE_AMOUNT = 0;
const DEFAULT_INVOICE_FORMAT = '';

/**
 * Invoice - InvoiceList component
 * @returns {JSX.Element}
 */
function InvoiceList({ firebase, projectId }: Props): JSX.Element {
  const [invoiceValue, invoiceLoading, invoiceError] = useCollection(
    firebase.firestore().collection('invoices').where('projectId', '==', projectId),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );

  const TOTAL_INVOICE = invoiceValue ? invoiceValue.docs.length : DEFAULT_INVOICE_AMOUNT;
  const INVOICE_NUMBER_FORMAT = TOTAL_INVOICE > DEFAULT_INVOICE_AMOUNT ? invoiceValue?.docs[0].data().invoiceNumber : DEFAULT_INVOICE_FORMAT;

  return invoiceLoading ? (
    <>
      Loading...
    </>
  ) : (
    <>
      <div className="title-bar">
        <h2>Invoice listing</h2>
        <AddNewInvoice firebase={firebase} projectId={projectId} totalInvoice={TOTAL_INVOICE} invoiceFormat={INVOICE_NUMBER_FORMAT} />
      </div>

      {invoiceError ? `${invoiceError}` : null}
      {invoiceValue ? (
        <div>
          {invoiceValue.docs.map((invoiceDoc) => (
            <InvoiceItem
              amount={invoiceDoc.data().amount}
              id={invoiceDoc.id}
              invoiceName={invoiceDoc.data().invoiceName}
              invoiceNote={invoiceDoc.data().invoiceNote}
              invoiceStatus={invoiceDoc.data().invoiceStatus}
              isChangeRequest={invoiceDoc.data().isChangeRequest}
              key={invoiceDoc.id}
              projectId={projectId}
              sendOn={invoiceDoc.data().sendOn}
              tax={invoiceDoc.data().tax}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}

export default InvoiceList;
