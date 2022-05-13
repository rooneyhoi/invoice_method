import { useContext } from 'react';
import Button from 'react-bootstrap/Button';

import { Firebase } from '../../../global/models/firebase';
import { ModalContext } from '../../../global/utils/modal-context';
import NewProjectForm from './project-form';

interface Props {
  firebase: Firebase;
  currentCompanyId: string;
}

/**
 * AddNewProject
 * @param {Props} props input props
 * @returns {JSX.Element}
 */
function AddNewProject({ firebase, currentCompanyId }: Props): JSX.Element {
  const { isModalDisplayed, showModal } = useContext(ModalContext);

  return (
    <>
      <Button variant="outline-primary" size="sm" onClick={showModal}>
        Add new project
      </Button>

      {isModalDisplayed ? <NewProjectForm firebase={firebase} currentCompanyId={currentCompanyId} /> : null}
    </>
  );
}

export default AddNewProject;
