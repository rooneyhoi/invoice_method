import './invoice-item.scss';

import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { Link } from 'react-router-dom';

import { convertFirebaseTime, formatStringAsNumber } from '../../../global/utils/converter';

interface Props {
  amount: number;
  id: string;
  invoiceName: string;
  invoiceNote: string;
  invoiceStatus: string;
  isChangeRequest: string;
  projectId: string;
  sendOn: Date;
  tax: number;
}

/**
 * InvoiceItem
 * @param {Props} props input props
 * @returns {JSX.Element}
 */
function InvoiceItem({
  amount,
  id,
  invoiceName,
  invoiceNote,
  invoiceStatus,
  isChangeRequest,
  projectId,
  sendOn,
  tax,
}: Props): JSX.Element {
  const invoiceDate = convertFirebaseTime(sendOn);
  const taxNumber = `${formatStringAsNumber(tax)}%`;
  const projectAmount = formatStringAsNumber(amount);

  return (
    <ListGroupItem>
      <div className="invoice-item">

        <span>{invoiceStatus}</span>

        <span>
          <Link to={`/invoice/print/${projectId}/${id}`}>{invoiceName}</Link>
        </span>

        <span>{projectAmount}</span>

        <span>{taxNumber}</span>

        <span>{invoiceDate}</span>

        <span>{isChangeRequest === 'on' ? 'CR' : ''}</span>

        <span>{invoiceNote}</span>

        <span>
          <Link to={`/invoice/print/${projectId}/${id}`}>SEND</Link>
        </span>

      </div>
    </ListGroupItem>
  );
}

export default InvoiceItem;
