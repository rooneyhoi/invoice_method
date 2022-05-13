import './invoice-content.scss';

interface Props {
  invoiceNumber: string;
}

/**
 * Invoice - Invoice content component
 * @returns {JSX.Element}
 */
function InvoiceNumber({ invoiceNumber }: Props): JSX.Element {
  return (
    <div>
      <p className="invoice-number-title">
        Invoice Number:
      </p>
      <p className="invoice-number-content">
        {invoiceNumber}
      </p>
    </div>
  );
}

export default InvoiceNumber;
