import { useContext } from 'react';
import Button from 'react-bootstrap/Button';

import { DEFAULT_BLANK_INVOICE_ID } from '../../../global/models/dtos/default-dto';
import { Firebase } from '../../../global/models/firebase';
import { ModalContext } from '../../../global/utils/modal-context';
import NewInvoiceForm from './invoice-form';

interface Props {
  firebase: Firebase;
  projectId: string;
  totalInvoice: number;
  invoiceFormat: string;
}

/**
 * AddNewInvoice
 * @param {Props} props input props
 * @returns {JSX.Element}
 */
function AddNewInvoice({ firebase, projectId, totalInvoice, invoiceFormat }: Props): JSX.Element {
  const { isModalDisplayed, showModal } = useContext(ModalContext);

  return (
    <>
      <Button variant="outline-primary" size="sm" onClick={showModal}>
        Add new invoice
      </Button>

      {isModalDisplayed ? (
        <NewInvoiceForm
          firebase={firebase}
          projectId={projectId}
          totalInvoice={totalInvoice}
          invoiceFormat={invoiceFormat}
          invoiceId={DEFAULT_BLANK_INVOICE_ID}
        />
      ) : null}
    </>
  );
}

export default AddNewInvoice;
