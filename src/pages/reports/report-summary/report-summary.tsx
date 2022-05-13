import './report-summary.scss';

import { useContext, useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';

import Loading from '../../../global/components/spinner/loading';
import { Firebase } from '../../../global/models/firebase';
import { CompanyContext } from '../../../global/utils/company-context';
import { log } from '../../../global/utils/logger';
import useInvoiceSummary from '../../../global/utils/use-invoice-summary';

interface Props {
  firebase: Firebase;
}

const CALCULATING_MESSAGE = 'Stay tune, the app is calculating data from Firestore';

/**
 * ReportSummary - ReportSummary component
 * @returns {JSX.Element}
 */
function ReportSummary({ firebase }: Props): JSX.Element {
  const { companyId: selectedCompany } = useContext(CompanyContext);
  const [calculating, setCalculating] = useState(false);

  const [companyValue, companyError] = useDocumentOnce(
    firebase.firestore().doc(`companies/${selectedCompany}`),
  );
  const companyObj = useMemo(() => companyValue?.data(), [companyValue]);

  const invoiceSummaryList = useInvoiceSummary(selectedCompany);
  log(invoiceSummaryList);

  return (
    <article className="project-list page-container">
      {companyError ? `${companyError}` : null}

      <div className="report-summary-title">
        <p>VIEWING</p>
        <h2>{companyObj ? `${companyObj?.name} company` : 'Please select a company'}</h2>
      </div>

      <p>Manually update cron-job summary here...</p>

      <div className="report-actions">
        <Row>

          <Col xs="auto">
            <Button variant="outline-primary" size="sm">
              Summary invoices from all clients and projects
            </Button>
          </Col>

          <Col xs="auto">
            { calculating ? <Loading loadingMessage={CALCULATING_MESSAGE} /> : null}
          </Col>

        </Row>

      </div>

      <div className="report-actions">

        <Row>

          <Col xs="auto">
            <Button variant="outline-primary" size="sm">
              Calculate CLTV for all clients
            </Button>
          </Col>

          <Col xs="auto">
            { calculating ? <Loading loadingMessage={CALCULATING_MESSAGE} /> : null}
          </Col>

        </Row>

      </div>

      <div className="report-actions">

        <Row>

          <Col xs="auto">
            <Button variant="outline-primary" size="sm">
              Summary overdue invoices
            </Button>
          </Col>

          <Col xs="auto">
            { calculating ? <Loading loadingMessage={CALCULATING_MESSAGE} /> : null}
          </Col>

        </Row>

      </div>

      <div className="report-actions">

        <Row>

          <Col xs="auto">
            <Button variant="outline-primary" size="sm">
              Summary late to send invoices
            </Button>
          </Col>

          <Col xs="auto">
            { calculating ? <Loading loadingMessage={CALCULATING_MESSAGE} /> : null}
          </Col>

        </Row>

      </div>

    </article>
  );
}

export default ReportSummary;
