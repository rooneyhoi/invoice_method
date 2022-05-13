import firebase from 'firebase';
import { useMemo } from 'react';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';

import { DEFAULT_INVOICE_LIST, DEFAULT_PROJECT_LIST } from '../models/dtos/default-dto';
import { convertFirebaseTime } from './converter';
import { log } from './logger';

/**
 * useInvoiceSummary
 * @param {string} selectedCompany: represent selected company
 * @returns {Array} invoice summary list base on logged in user's Id and selected company Id
 */
function useInvoiceSummary(selectedCompany: string) {
  const [projectValue, projectLoading, projectError] = useCollectionOnce(
    firebase
      .firestore()
      .collection('projects')
      .where('parentCompanyId', '==', selectedCompany),
  );

  const projectList = useMemo(
    () => (projectValue ? projectValue?.docs.map((project) => ({
      projectId: project.id,
      projectName: project.data().projectName,
      clientId: project.data().clientId,
      clientName: project.data().clientName,
      budget: project.data().budget,
      netPayment: project.data().netPayment,
    })) : DEFAULT_PROJECT_LIST),
    [projectValue],
  );

  const [invoiceValue, invoiceLoading, invoiceError] = useCollectionOnce(
    firebase
      .firestore()
      .collection('invoices'),
  );

  const invoiceList = useMemo(
    () => (invoiceValue ? invoiceValue?.docs.map((invoice) => ({
      invoiceId: invoice.id,
      projectId: invoice.data().projectId,
      invoiceName: invoice.data().invoiceName,
      amount: invoice.data().amount,
      sendOn: invoice.data().sendOn ? convertFirebaseTime(invoice.data().sendOn) : '',
      paidAmount: invoice.data().paidAmount,
      paidOn: invoice.data().paidOn ? convertFirebaseTime(invoice.data().paidOn) : '',
      invoiceNotes: invoice.data().invoiceNotes,
      invoiceStatus: invoice.data().invoiceStatus,
    })) : DEFAULT_INVOICE_LIST),
    [invoiceValue],
  );

  log(projectLoading || invoiceLoading ? 'Loading project & invoice...' : null);
  log(projectError || invoiceError ? 'Error while loading data...' : null);

  const invoiceSummaryList = [];

  for (const project of projectList) {
    for (const invoice of invoiceList) {
      if (project.projectId === invoice.projectId) {
        invoiceSummaryList.push({ ...project, ...invoice });
      }
    }
  }

  return invoiceSummaryList;
}

export default useInvoiceSummary;
