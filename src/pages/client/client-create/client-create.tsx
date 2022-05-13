import { useContext } from 'react';
import Button from 'react-bootstrap/Button';

import { Firebase } from '../../../global/models/firebase';
import { ModalContext } from '../../../global/utils/modal-context';
import NewClientForm from './client-form';

interface Props {
  firebase: Firebase;
  currentCompanyId: string;
}

/**
 * AddNewClient
 * @param {Props} props input props
 * @returns {JSX.Element}
 */
function AddNewClient({ firebase, currentCompanyId }: Props): JSX.Element {
  const { isModalDisplayed, showModal } = useContext(ModalContext);

  return (
    <>
      <Button variant="outline-primary" size="sm" onClick={showModal}>
        Add new client
      </Button>

      {isModalDisplayed ? <NewClientForm firebase={firebase} currentCompanyId={currentCompanyId} /> : null}
    </>
  );
}

export default AddNewClient;
