import './project-detail.scss';

import { useParams } from 'react-router-dom';

import { Firebase } from '../../../global/models/firebase';
import InvoiceList from '../invoice-list/invoice-list';
import ProjectInformation from './project-information';

interface Props {
  firebase: Firebase;
}

interface Parameter {
  projectId: string;
}

/**
 * Project - ProjectDetail component
 * @returns {JSX.Element}
 */
function ProjectDetail({ firebase }: Props): JSX.Element {
  const { projectId } : Parameter = useParams();

  return (
    <article className="project-detail page-container">
      <ProjectInformation firebase={firebase} projectId={projectId} isShowBudget />
      <InvoiceList firebase={firebase} projectId={projectId} />
    </article>
  );
}

export default ProjectDetail;
