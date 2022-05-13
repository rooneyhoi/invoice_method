import './invoice-subTotal.scss';

import Table from 'react-bootstrap/Table';

import { formatStringAsNumber } from '../../../global/utils/converter';

interface Props {
  amount: number;
  discount: number;
  currency: string;
  tax: string;
  hideLabel: boolean;
}

const HUNDRED_PERCENT = 100;

/**
 * Invoice - Sub Total component
 * @returns {JSX.Element}
 */
function InvoiceSubTotal({ amount, discount, currency, tax, hideLabel }: Props): JSX.Element {
  const taxAmount = amount * (Number(tax) / HUNDRED_PERCENT);
  const subTotal = amount - taxAmount;

  return (
    <>
      <Table borderless responsive="sm" size="sm" className="sub-total-table">
        <tbody>
          <tr>
            <td className="sub-total-label">Subtotal:</td>
            <td><span className="sub-total-data">{formatStringAsNumber(subTotal)}</span></td>
          </tr>

          <tr>
            <td className="sub-total-label">Discount:</td>
            <td><span className="sub-total-data">{formatStringAsNumber(discount)}</span></td>
          </tr>

          <tr>
            <td className="sub-total-label">Currency:</td>
            <td><span className="sub-total-data">{currency}</span></td>
          </tr>

          <tr>
            <td className="sub-total-label">
              {`Tax (${tax}%):`}
            </td>
            <td><span className="sub-total-data">{formatStringAsNumber(taxAmount)}</span></td>
          </tr>

          <tr>
            <td className={`grand-total-label${hideLabel ? '-hide' : ''}`}>
              <div className="grand-total-block">Total amount due:</div>
            </td>
            <td>
              <div className={`grand-total-block${hideLabel ? '-small' : ''}`}>
                <span className={`grand-total-amount${hideLabel ? '-small' : ''}`}>{formatStringAsNumber(amount)}</span>
                <span>{currency}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default InvoiceSubTotal;
