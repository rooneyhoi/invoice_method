import { Col, Row } from 'react-bootstrap';

import InvoiceDueDate from '../invoice-print/invoice-dueDate';

interface Props {
  invoiceName: string;
  netPayment: number;
  projectName: string;
  sendOn: string;
}

/**
 * Invoice - InvoiceInformation component
 * @returns {JSX.Element}
 */
function InvoiceInformation({ invoiceName, netPayment, projectName, sendOn }: Props): JSX.Element {
  return (
    <>
      <div className="due-date-container">
        <Row>

          <Col xs="auto">
            <span className="due-date-label">Project:</span>
          </Col>

          <Col xs="auto">
            <span className="due-date-label">{projectName}</span>
          </Col>

        </Row>

        <InvoiceDueDate sendOn={sendOn} netPayment={netPayment} showSmallText />

        <Row>

          <Col xs="auto">
            <span className="due-date-label">Invoice:</span>
          </Col>

          <Col xs="auto">
            <span className="due-date-label">{invoiceName}</span>
          </Col>

        </Row>
      </div>
    </>
  );
}

export default InvoiceInformation;
