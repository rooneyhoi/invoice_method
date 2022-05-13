import './invoice-reminder.scss';

// This is to do
// The scheduled date of an invoice to send, that has not been sent.
// List all invoices that has due date greater than current date, and count the total of invoice

interface Props {
  companyId: string;
}

/**
 * InvoiceSendReminder
 * @param {Props} props input props
 * @returns {JSX.Element}
 */
function InvoiceSendReminder({ companyId }: Props): JSX.Element {
  return (
    <div className="send_reminder">
      <span>5 INVOICES TO SEND VALUE AT $32,830</span>
    </div>
  );
}

export default InvoiceSendReminder;
