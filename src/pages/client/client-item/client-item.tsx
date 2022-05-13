import './client-item.scss';

import { useCallback, useContext, useEffect, useState } from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { Link } from 'react-router-dom';

import { Firebase } from '../../../global/models/firebase';
import { ModalContext } from '../../../global/utils/modal-context';
import UpdateClientForm from '../client-create/client-update';
import CLTV from './client-cltv';

interface Props {
  abbreviation: string;
  currentCompanyId: string;
  firebase: Firebase;
  id: string;
  legalName: string;
  name: string;
}

/**
 * ClientItem
 * @param {Props} props input props
 * @returns {JSX.Element}
 */
function ClientItem({ abbreviation, currentCompanyId, firebase, id, legalName, name }: Props): JSX.Element {
  const { isModalDisplayed, showModal } = useContext(ModalContext);
  const [showClientUpdateModal, setShowClientUpdateModal] = useState(false);

  useEffect(() => {
    if (!isModalDisplayed) {
      setShowClientUpdateModal(false);
    }
  }, [isModalDisplayed]);

  const updateClient = useCallback(
    () => {
      setShowClientUpdateModal(true);
      showModal();
    },
    [showModal],
  );

  return (
    <>
      <ListGroupItem>
        <div className="client-item">
          <span><Link to={`/client/detail/${id}`}>{name}</Link></span>
          <span>{legalName}</span>
          <span><CLTV id={id} /></span>
          <span>{abbreviation}</span>
          <span onClick={updateClient} onKeyDown={updateClient} role="button" tabIndex={-1}>
            EDIT
          </span>
        </div>
      </ListGroupItem>
      {showClientUpdateModal ? (
        <UpdateClientForm firebase={firebase} clientId={id} currentCompanyId={currentCompanyId} />
      ) : null}
    </>
  );
}

export default ClientItem;
