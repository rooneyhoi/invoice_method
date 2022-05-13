import './project-information.scss';

import { useMemo } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';

import { Firebase } from '../../../global/models/firebase';
import { formatStringAsNumber } from '../../../global/utils/converter';

interface Props {
  firebase: Firebase;
  projectId: string;
  isShowBudget: boolean;
}

/**
 * Project - ProjectInformation component
 * @returns {JSX.Element}
 */
function ProjectInformation({ firebase, projectId, isShowBudget }: Props): JSX.Element {
  const [value, loading, error] = useDocumentOnce(
    firebase.firestore().doc(`projects/${projectId}`),
  );

  const projectObj = useMemo(() => value?.data(), [value]);

  return loading ? (
    <>
      Loading...
    </>
  ) : (
    <>
      {error ? `${error}` : null}
      {projectObj ? (
        <div>
          <p>
            {projectObj.clientName}
          </p>

          <h2 className="project-name">
            <Link to={`/project/detail/${projectId}`}>{projectObj.projectName}</Link>
          </h2>

          {isShowBudget && (
            <div>
              <Row>
                <Col xs="auto">
                  <h3>{formatStringAsNumber(projectObj.budget)}</h3>
                </Col>
                <Col xs="auto">
                  <span>{projectObj.currency}</span>
                </Col>
              </Row>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}

export default ProjectInformation;
