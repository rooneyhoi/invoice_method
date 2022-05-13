import './invoice-print.scss';

import { useEffect, useMemo, useState } from 'react';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';

import { Firebase } from '../../../global/models/firebase';
import { convertFirebaseTime } from '../../../global/utils/converter';
import { NET_PAYMENT, ZERO_DEBT } from '../../../global/utils/global-settings';
import ClientInformation from '../../client/client-information/client-information';
import CompanyInformation from '../../company/company-info/company-information';
import InvoiceContent from './invoice-content';
import InvoiceDueDate from './invoice-dueDate';
import InvoiceNumber from './invoice-number';
import InvoicePayableTo from './invoice-payableTo';
import InvoicePONumber from './invoice-PO-number';
import InvoiceSubTotal from './invoice-subTotal';

interface Props {
  firebase: Firebase;
  projectId: string;
  invoiceId: string;
  onInit: () => void;
}

/**
 * Invoice - InvoicePrint component
 * @returns {JSX.Element}
 */
function InvoicePrintDocument({ firebase, projectId, invoiceId, onInit }: Props): JSX.Element {
  const [companyInfoReady, setCompanyInfoReady] = useState(false);
  const [clientInfoReady, setClientInfoReady] = useState(false);
  const [projectValue, projectLoading, projectError] = useDocumentOnce(
    firebase.firestore().doc(`projects/${projectId}`),
  );
  const projectObj = useMemo(() => projectValue?.data(), [projectValue]);

  const [invoiceValue, invoiceLoading, invoiceError] = useDocumentOnce(
    firebase.firestore().doc(`invoices/${invoiceId}`),
  );
  const invoiceObj = useMemo(() => invoiceValue?.data(), [invoiceValue]);
  const SEND_ON = invoiceObj?.sendOn ? convertFirebaseTime(invoiceObj.sendOn) : '';
  const PAID_ON = invoiceObj?.paidOn ? convertFirebaseTime(invoiceObj.paidOn) : '';
  const PENDING_PAYMENT = invoiceObj?.paidAmount ? invoiceObj.amount - invoiceObj.paidAmount : null;

  useEffect(() => {
    if (!projectLoading && !invoiceLoading && companyInfoReady && clientInfoReady) {
      onInit();
    }
  }, [clientInfoReady, companyInfoReady, invoiceLoading, onInit, projectLoading]);

  return projectLoading || invoiceLoading ? (
    <>
      Loading...
    </>
  ) : (
    <>
      {projectError ? `${projectError}` : null}
      {invoiceError ? `${invoiceError}` : null}

      <div className="invoice-page-content">
        <div className="block-invoice-information">
          <InvoiceNumber invoiceNumber={invoiceObj?.invoiceNumber} />
          {projectObj?.PONumber ? (<InvoicePONumber invoicePONumber={projectObj.PONumber} />) : null}
          <CompanyInformation firebase={firebase} companyId={projectObj?.companyId} onInit={() => setCompanyInfoReady(true)} />
        </div>

        <div className="block-client-information">
          <ClientInformation firebase={firebase} clientId={projectObj?.clientId} onInit={() => setClientInfoReady(true)} />
          <InvoiceDueDate sendOn={SEND_ON} netPayment={NET_PAYMENT} showSmallText={false} />
        </div>

        {PENDING_PAYMENT === ZERO_DEBT ? (
          <div className="block-payment-status">
            <span>Invoice is fully paid on</span>
            <span>
              {PAID_ON}
            </span>
          </div>
        ) : null}

        <div className="block-invoice-notes">
          <span>{projectObj?.projectName}</span>
          <h3 className="invoice-highlight-content">{invoiceObj ? invoiceObj.invoiceName : ''}</h3>
          <InvoiceContent firebase={firebase} invoiceContent={invoiceObj?.invoiceContent} invoiceId={invoiceId} />
        </div>

        <div className="block-sub-total">
          <InvoiceSubTotal
            amount={invoiceObj?.amount}
            discount={invoiceObj?.discount}
            currency={projectObj?.currency}
            tax={invoiceObj?.tax}
            hideLabel={false}
          />
        </div>

        <div>
          <InvoicePayableTo firebase={firebase} bankId={projectObj?.currencyAccount} />
        </div>

      </div>
    </>
  );
}

export default InvoicePrintDocument;
