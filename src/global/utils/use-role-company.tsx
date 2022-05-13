import firebase from 'firebase';
import { useMemo } from 'react';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';

import { DEFAULT_COMPANY, DEFAULT_COMPANY_ID_LIST } from '../models/dtos/default-dto';

/**
 * useRoleCompany
 * @param {string} userId: represent local storage key
 * @returns {Array} company list base on logged in user's Id
 */
function useRoleCompany(userId: string) {
  const [userRolesValue] = useDocument(
    firebase.firestore().doc(`userRoles/${userId}`),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );

  const userCompanies : string[] = useMemo(
    () => (userRolesValue ? userRolesValue?.data()?.companies : DEFAULT_COMPANY_ID_LIST),
    [userRolesValue],
  );

  const queryDocumentId = firebase.firestore.FieldPath.documentId();
  const [valueCompanies] = useCollection(
    firebase
      .firestore()
      .collection('companies')
      .where(queryDocumentId, 'in', userCompanies),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );

  const companyList = useMemo(
    () => (valueCompanies ? valueCompanies?.docs.map((company) => ({
      id: company.id,
      name: company.data().name,
    })) : DEFAULT_COMPANY),
    [valueCompanies],
  );

  return companyList;
}

export default useRoleCompany;
