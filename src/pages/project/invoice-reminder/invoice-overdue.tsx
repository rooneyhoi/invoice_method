interface Props {
  projectId: string;
}

/**
 * OverdueInvoice
 * @param {Props} props input props
 * @returns {JSX.Element}
 */
function OverdueInvoice({ projectId }: Props): JSX.Element {
  return (
    <div>
      <span>Overdue Invoice</span>
    </div>
  );
}

export default OverdueInvoice;
