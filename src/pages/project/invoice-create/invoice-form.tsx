import '../../../global/form.scss';
import 'react-datepicker/dist/react-datepicker.css';

import { FormEvent, useCallback, useContext, useEffect, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import DatePicker from 'react-datepicker';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';

import { Firebase } from '../../../global/models/firebase';
import { CR_OFF } from '../../../global/utils/global-settings';
import { generateInvoiceNumber } from '../../../global/utils/invoice-generator';
import { log } from '../../../global/utils/logger';
import { ModalContext } from '../../../global/utils/modal-context';
import useInput, { isNotEmpty, isNumber } from '../../../global/utils/use-input';

interface Props {
  firebase: Firebase;
  projectId: string;
  totalInvoice: number;
  invoiceFormat: string;
  invoiceId: string;
}

const INVOICE_INITIAL_STATUS = 'Draft';
const DEFAULT_TAX_CONTENT = 'ie 0.0';

/**
 * NewInvoiceForm
 * @param {Props} props: input properties
 * @returns {JSX.Element}
 */
function NewInvoiceForm({ firebase, projectId, totalInvoice, invoiceFormat, invoiceId }: Props): JSX.Element {
  const { isModalDisplayed, hideModal } = useContext(ModalContext);

  const [projectValue, projectLoading] = useDocumentOnce(
    firebase.firestore().doc(`projects/${projectId}`),
  );
  const projectObj = useMemo(() => projectValue?.data(), [projectValue]);

  const [clientValue, clientLoading, clientError] = useDocumentOnce(
    firebase.firestore().doc(`clients/${projectObj?.clientId}`),
  );
  const clientObj = useMemo(() => clientValue?.data(), [clientValue]);
  const CLIENT_ABBREVIATION = clientObj?.abbreviation ? clientObj.abbreviation : '';
  const CLIENT_TAX = clientObj?.taxRate ? clientObj.taxRate : DEFAULT_TAX_CONTENT;

  const {
    hasError: amountHasError,
    reset: resetAmount,
    value: amountValue,
    valueChangeHandler: amountChangeHandler,
  } = useInput(isNumber);

  const {
    reset: resetDiscount,
    value: discountValue,
    valueChangeHandler: discountChangeHandler,
  } = useInput(isNumber);

  const {
    reset: resetInvoiceContent,
    value: invoiceContentValue,
    valueChangeHandler: invoiceContentChangeHandler,
  } = useInput(isNotEmpty);

  const {
    hasError: invoiceNameHasError,
    reset: resetInvoiceName,
    value: invoiceNameValue,
    valueChangeHandler: invoiceNameChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetSendOn,
    dateValue: sendOnValue,
    valueDateHandler: sendOnChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetIsChangeRequest,
    value: isChangeRequestValue,
    valueCheckHandler: isChangeRequestChangeHandler,
  } = useInput(isNotEmpty);

  const {
    value: taxValue,
    reset: resetTax,
    valueChangeHandler: taxChangeHandler,
    valueInitHandler: taxInitHandler,
  } = useInput(isNumber);

  // Note: To use client's tax in CREATE mode only
  useEffect(() => {
    if (CLIENT_TAX && !invoiceId) {
      taxInitHandler(CLIENT_TAX);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CLIENT_TAX, invoiceId]);

  /**
   * Handler saving data to Firestore
   * @param {()} successCallback function
   */
  const saveDataToFirestore = useCallback(
    (invoiceStatus: string) => {
      const NEW_INVOICE_NUMBER = generateInvoiceNumber(CLIENT_ABBREVIATION, totalInvoice, invoiceFormat);

      firebase
        .firestore()
        .collection('invoices')
        .add({
          amount: amountValue,
          discount: discountValue,
          invoiceContent: invoiceContentValue,
          invoiceName: invoiceNameValue,
          invoiceNote: '',
          invoiceNumber: NEW_INVOICE_NUMBER,
          invoiceStatus,
          isChangeRequest: isChangeRequestValue === '' ? CR_OFF : isChangeRequestValue,
          projectId,
          sendOn: sendOnValue,
          tax: taxValue,
        })
        .then(
          hideModal,
        )
        .catch((error) => {
          log(error);
        });
    },
    [
      amountValue,
      CLIENT_ABBREVIATION,
      discountValue,
      firebase,
      hideModal,
      invoiceContentValue,
      invoiceFormat,
      invoiceNameValue,
      isChangeRequestValue,
      projectId,
      sendOnValue,
      taxValue,
      totalInvoice,
    ],
  );

  const createNewInvoiceHandler = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      saveDataToFirestore(INVOICE_INITIAL_STATUS);

      resetAmount();
      resetDiscount();
      resetInvoiceContent();
      resetInvoiceName();
      resetIsChangeRequest();
      resetSendOn();
      resetTax();
    },
    [
      resetAmount,
      resetDiscount,
      resetInvoiceContent,
      resetInvoiceName,
      resetIsChangeRequest,
      resetSendOn,
      resetTax,
      saveDataToFirestore,
    ],
  );

  return projectLoading || clientLoading ? (
    <>
      Loading...
    </>
  ) : (
    <>
      {clientError ? `${clientError}` : null}
      <Modal
        backdrop="static"
        keyboard={false}
        onHide={hideModal}
        show={isModalDisplayed}
        size="lg"
      >
        <Form onSubmit={createNewInvoiceHandler}>
          <Modal.Header closeButton>
            <Modal.Title>Invoice Details</Modal.Title>
          </Modal.Header>

          <Modal.Body className="show-grid">

            <Row className="g-1">
              <Col md>
                <Form.Group
                  className={`input-group ${
                    invoiceNameHasError ? 'border-danger' : 'mb-3'
                  }`}
                >
                  <Form.Label>INVOICE NAME</Form.Label>
                  <Form.Control
                    onChange={invoiceNameChangeHandler}
                    placeholder="Invoice name, ie. UAT delivery"
                    required
                    type="text"
                    value={invoiceNameValue}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-2">
              <Col md>
                <Form.Group
                  className={`input-group ${
                    amountHasError ? 'border-danger' : 'mb-3'
                  }`}
                >
                  <Form.Label>AMOUNT</Form.Label>
                  <Form.Control
                    onChange={amountChangeHandler}
                    placeholder="Number only"
                    required
                    type="number"
                    value={amountValue}
                  />
                </Form.Group>
              </Col>

              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>TAX</Form.Label>
                  <Form.Control
                    onChange={taxChangeHandler}
                    placeholder={DEFAULT_TAX_CONTENT}
                    type="number"
                    value={taxValue}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-2">
              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>SEND ON</Form.Label>
                  <DatePicker
                    onChange={sendOnChangeHandler}
                    required
                    selected={sendOnValue}
                    wrapperClassName="date-picker"
                  />
                </Form.Group>
              </Col>

              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>DISCOUNT</Form.Label>
                  <Form.Control
                    onChange={discountChangeHandler}
                    placeholder="ie. 0"
                    type="number"
                    value={discountValue}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-1">
              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>INVOICE NOTE</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="ie. 40 hours"
                    style={{ height: '200px' }}
                    onChange={invoiceContentChangeHandler}
                    value={invoiceContentValue}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md>
                <Form.Check
                  type="checkbox"
                  id="IsChangeRequest"
                  label="Invoice is a Change Request"
                  onChange={isChangeRequestChangeHandler}
                  value={CR_OFF}
                />
              </Col>
            </Row>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>

        </Form>
      </Modal>
    </>
  );
}

export default NewInvoiceForm;
