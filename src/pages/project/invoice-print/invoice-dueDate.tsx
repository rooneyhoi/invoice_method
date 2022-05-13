import './invoice-dueDate.scss';

import { Col, Row } from 'react-bootstrap';
import Moment from 'react-moment';

interface Props {
  sendOn: string;
  netPayment: number;
  showSmallText: boolean;
}

/**
 * Invoice - InvoiceDueDate component
 * @returns {JSX.Element}
 */
function InvoiceDueDate({ sendOn, netPayment, showSmallText }: Props): JSX.Element {
  return (
    <>
      <div className="due-date-container">
        <Row>
          <Col xs="auto">
            <span className="due-date-label">Due on:</span>
          </Col>

          <Col xs="auto">
            <span className={`due-date-value${showSmallText ? '-small' : ''}`}>
              <Moment add={{ days: netPayment }} format="MM/DD/YYYY">
                {sendOn}
              </Moment>
            </span>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default InvoiceDueDate;
