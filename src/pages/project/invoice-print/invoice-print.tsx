import './invoice-print.scss';

import html2canvas from 'html2canvas';
import { useCallback, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import { Firebase } from '../../../global/models/firebase';
import ProjectInformation from '../project-detail/project-information';
import InvoiceActionIcons from './invoice-action-icons';
import InvoicePrintDocument from './invoice-print-document';

interface Props {
  firebase: Firebase;
}

interface Parameter {
  projectId: string;
  invoiceId: string;
}

const RETRY_GENERATE_CANVAS_DELAY_MS = 100;

/**
 * Invoice - InvoicePrint component
 * @returns {JSX.Element}
 */
function InvoicePrint({ firebase }: Props): JSX.Element {
  const { invoiceId, projectId }: Parameter = useParams();
  const [dataURL, setDataURL] = useState<string>();

  const INVOICE_DOC_TITLE = `Invoice: ${invoiceId}`;
  const componentRef = useRef<HTMLDivElement>(null);

  const invoiceDocument = useCallback(() => componentRef.current, []);

  const handlePrint = useReactToPrint({
    content: invoiceDocument,
    documentTitle: INVOICE_DOC_TITLE,
  });

  const setCanvasOnInit = useCallback(() => {
    if (componentRef.current) {
      html2canvas(componentRef.current).then((canvas) => setDataURL(canvas.toDataURL()));
    } else {
      setTimeout(setCanvasOnInit, RETRY_GENERATE_CANVAS_DELAY_MS);
    }
  }, [componentRef]);

  return (
    <article className="page-container invoice-page">
      <div className="invoice-page-header">
        <div>
          <ProjectInformation firebase={firebase} projectId={projectId} isShowBudget={false} />
        </div>
        <div>
          <InvoiceActionIcons firebase={firebase} projectId={projectId} invoiceId={invoiceId} dataURL={dataURL} />
          <span>
            <Link to="#" onClick={handlePrint}>PRINT</Link>
          </span>
        </div>
      </div>

      <div ref={componentRef}>
        <InvoicePrintDocument firebase={firebase} projectId={projectId} invoiceId={invoiceId} onInit={setCanvasOnInit} />
      </div>
    </article>
  );
}

export default InvoicePrint;
