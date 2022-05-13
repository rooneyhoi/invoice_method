import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Firebase } from '../../../global/models/firebase';
import { ModalContext } from '../../../global/utils/modal-context';
import PaidInvoiceForm from '../invoice-paid/invoice-paid-form';
import SendInvoiceForm from '../invoice-send/invoice-send-form';

interface Props {
  firebase: Firebase;
  invoiceId: string;
  projectId: string;
  dataURL: string | undefined;
}

/**
 * Invoice - InvoiceActionIcons component
 * @returns {JSX.Element}
 */
function InvoiceActionIcons({ firebase, invoiceId, projectId, dataURL }: Props): JSX.Element {
  const { isModalDisplayed, showModal } = useContext(ModalContext);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);

  useEffect(() => {
    if (!isModalDisplayed) {
      setShowSendModal(false);
      setShowPaidModal(false);
    }
  }, [isModalDisplayed]);

  const showSendInvoiceModal = useCallback(
    () => {
      setShowSendModal(true);
      showModal();
    },
    [showModal],
  );

  const showPaidInvoiceModal = useCallback(
    () => {
      setShowPaidModal(true);
      showModal();
    },
    [showModal],
  );

  return (
    <>
      <span>
        <Link to="#" onClick={showSendInvoiceModal}>SEND</Link>
        {showSendModal && dataURL ? (
          <SendInvoiceForm firebase={firebase} projectId={projectId} dataURL={dataURL} />
        ) : null}
      </span>

      <span>
        <Link to="#" onClick={showPaidInvoiceModal}>PAID</Link>
        {showPaidModal ? (
          <PaidInvoiceForm firebase={firebase} projectId={projectId} invoiceId={invoiceId} />
        ) : null}
      </span>
    </>
  );
}

export default InvoiceActionIcons;
