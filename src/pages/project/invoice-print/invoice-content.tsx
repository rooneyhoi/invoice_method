import './invoice-content.scss';

import { useCallback, useContext, useEffect, useState } from 'react';

import { Firebase } from '../../../global/models/firebase';
import { ModalContext } from '../../../global/utils/modal-context';
import UpdateInvoiceForm from '../invoice-create/invoice-update';

interface Props {
  firebase: Firebase;
  invoiceContent: string;
  invoiceId: string;
}

/**
 * Invoice - Invoice content component
 * @returns {JSX.Element}
 */
function InvoiceContent({ firebase, invoiceContent, invoiceId }: Props): JSX.Element {
  const { isModalDisplayed, showModal } = useContext(ModalContext);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (!isModalDisplayed) {
      setShowInvoiceModal(false);
    }
  }, [isModalDisplayed]);

  const updateInvoiceContent = useCallback(
    () => {
      setShowInvoiceModal(true);
      showModal();
    },
    [showModal],
  );

  return (
    <>
      <div onClick={updateInvoiceContent} onKeyDown={updateInvoiceContent} role="button" tabIndex={-1}>
        <p className="display-line-break">
          {invoiceContent}
        </p>
      </div>
      {showInvoiceModal ? (
        <UpdateInvoiceForm firebase={firebase} invoiceId={invoiceId} />
      ) : null}
    </>
  );
}

export default InvoiceContent;
