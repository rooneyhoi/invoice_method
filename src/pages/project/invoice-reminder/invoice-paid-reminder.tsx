import './invoice-reminder.scss';

// This is to do
// The scheduled date of an invoice to send, that has not been sent.
// List all invoices that has due date greater than current date, and count the total of invoice

interface Props {
  companyId: string;
}

/**
 * InvoicePaidReminder
 * @param {Props} props input props
 * @returns {JSX.Element}
 */
function InvoicePaidReminder({ companyId }: Props): JSX.Element {
  return (
    <div className="paid_reminder">
      <span>10 INVOICES OVERDUE VALUE AT $132,830</span>
    </div>
  );
}

export default InvoicePaidReminder;
