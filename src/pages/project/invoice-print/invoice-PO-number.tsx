import './invoice-content.scss';

interface Props {
  invoicePONumber: string;
}

/**
 * Invoice - Invoice content component
 * @returns {JSX.Element}
 */
function InvoicePONumber({ invoicePONumber }: Props): JSX.Element {
  return (
    <div>
      <p className="invoice-number-title">
        PO Number:
      </p>
      <p className="invoice-number-content">
        {invoicePONumber}
      </p>
    </div>
  );
}

export default InvoicePONumber;
