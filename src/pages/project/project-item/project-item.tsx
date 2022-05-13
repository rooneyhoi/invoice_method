import './project-item.scss';

import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { Link } from 'react-router-dom';

import OverdueInvoice from '../invoice-reminder/invoice-overdue';

interface Props {
  id: string;
  projectName: string;
  clientName: string;
}

/**
 * ProjectItem
 * @param {Props} props input props
 * @returns {JSX.Element}
 */
function ProjectItem({ id, projectName, clientName }: Props): JSX.Element {
  return (
    <ListGroupItem>
      <div className="project-item">
        <span><Link to={`/project/detail/${id}`}>{projectName}</Link></span>
        <span>{clientName}</span>
        <span><OverdueInvoice projectId={id} /></span>
        <span><Link to={`/project/detail/${id}`}>DETAILS</Link></span>
        <span>EDIT</span>
      </div>
    </ListGroupItem>
  );
}

export default ProjectItem;
