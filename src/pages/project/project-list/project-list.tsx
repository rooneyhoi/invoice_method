import './project-list.scss';

import { useContext, useMemo } from 'react';
import { useCollection, useDocumentOnce } from 'react-firebase-hooks/firestore';

import { Firebase } from '../../../global/models/firebase';
import { CompanyContext } from '../../../global/utils/company-context';
import InvoicePaidReminder from '../invoice-reminder/invoice-paid-reminder';
import InvoiceSendReminder from '../invoice-reminder/invoice-send-reminder';
import AddNewProject from '../project-create/project-create';
import ProjectItem from '../project-item/project-item';

export interface Props {
  firebase: Firebase;
}

/**
 * Project - ProjectList component
 * @returns {JSX.Element}
 */
function ProjectList({ firebase }: Props): JSX.Element {
  const { companyId: selectedCompany } = useContext(CompanyContext);

  const [projectValue, projectLoading, projectError] = useCollection(
    firebase.firestore().collection('projects').where('parentCompanyId', '==', selectedCompany),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );
  const projectList = useMemo(() => projectValue?.docs, [projectValue]);

  const [companyValue, companyLoading, companyError] = useDocumentOnce(
    firebase.firestore().doc(`companies/${selectedCompany}`),
  );
  const companyObj = useMemo(() => companyValue?.data(), [companyValue]);

  return projectLoading || companyLoading ? (
    <article className="project-list page-container">
      Loading...
    </article>
  ) : (
    <article className="project-list page-container">
      <InvoicePaidReminder companyId="0" />
      <InvoiceSendReminder companyId="0" />

      {companyError ? `${companyError}` : null}
      <div className="title-bar">
        <div>
          <p>VIEWING</p>
          <h2>{companyObj ? `${companyObj?.name} Projects` : 'Please select a company'}</h2>
        </div>
        <span>
          <AddNewProject firebase={firebase} currentCompanyId={selectedCompany} />
        </span>
      </div>

      {projectError ? `${projectError}` : null}
      {projectList ? (
        <div>
          {projectList.map((projectDoc) => (
            <ProjectItem
              id={projectDoc.id}
              key={projectDoc.id}
              clientName={projectDoc.data().clientName}
              projectName={projectDoc.data().projectName}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default ProjectList;
