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

import { InvoiceDTO } from '../../../global/models/dtos/invoice-dto';
import { Firebase } from '../../../global/models/firebase';
import { convertFirebaseTime } from '../../../global/utils/converter';
import { CR_OFF, CR_ON, ZERO_VALUE } from '../../../global/utils/global-settings';
import { log } from '../../../global/utils/logger';
import { ModalContext } from '../../../global/utils/modal-context';
import useInput, { isNotEmpty, isNumber } from '../../../global/utils/use-input';

interface Props {
  firebase: Firebase;
  invoiceId: string;
}

const DEFAULT_TAX_CONTENT = 'ie 0.0';

const InvoiceItem: InvoiceDTO = {
  amount: ZERO_VALUE,
  discount: ZERO_VALUE,
  invoiceContent: '',
  invoiceName: '',
  isChangeRequest: CR_OFF,
  sendOn: new Date(),
  tax: '',
};

/**
 * NewInvoiceForm
 * @param {Props} props: input properties
 * @returns {JSX.Element}
 */
function UpdateInvoiceForm({ firebase, invoiceId }: Props): JSX.Element {
  const { isModalDisplayed, hideModal } = useContext(ModalContext);

  const [invoiceValue, invoiceLoading, invoiceError] = useDocumentOnce(
    firebase.firestore().doc(`invoices/${invoiceId}`),
  );
  const invoiceObj = useMemo(() => invoiceValue?.data(), [invoiceValue]);

  if (invoiceObj) {
    InvoiceItem.amount = invoiceObj.amount;
    InvoiceItem.discount = invoiceObj.discount;
    InvoiceItem.invoiceContent = invoiceObj.invoiceContent;
    InvoiceItem.invoiceName = invoiceObj.invoiceName;
    InvoiceItem.isChangeRequest = invoiceObj.isChangeRequest;
    InvoiceItem.sendOn = new Date(convertFirebaseTime(invoiceObj.sendOn));
    InvoiceItem.tax = invoiceObj.tax;
  }

  const {
    hasError: amountHasError,
    reset: resetAmount,
    value: amountValue,
    valueChangeHandler: amountChangeHandler,
    valueInitHandler: amountInitHandler,
  } = useInput(isNumber);

  const {
    reset: resetDiscount,
    value: discountValue,
    valueChangeHandler: discountChangeHandler,
    valueInitHandler: discountInitHandler,
  } = useInput(isNumber);

  const {
    reset: resetInvoiceContent,
    value: invoiceContentValue,
    valueChangeHandler: invoiceContentChangeHandler,
    valueInitHandler: invoiceContentInitHandler,
  } = useInput(isNotEmpty);

  const {
    hasError: invoiceNameHasError,
    reset: resetInvoiceName,
    value: invoiceNameValue,
    valueChangeHandler: invoiceNameChangeHandler,
    valueInitHandler: invoiceNameInitHandler,
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
    valueInitHandler: isChangeRequestInitHandler,
  } = useInput(isNotEmpty);

  const {
    value: taxValue,
    reset: resetTax,
    valueChangeHandler: taxChangeHandler,
    valueInitHandler: taxInitHandler,
  } = useInput(isNumber);

  const bindInvoiceData = useCallback(
    () => {
      amountInitHandler(InvoiceItem.amount.toString());
      discountInitHandler(InvoiceItem.discount.toString());
      invoiceContentInitHandler(InvoiceItem.invoiceContent);
      invoiceNameInitHandler(InvoiceItem.invoiceName);
      sendOnChangeHandler(InvoiceItem.sendOn);
      isChangeRequestInitHandler(InvoiceItem.isChangeRequest);
      taxInitHandler(InvoiceItem.tax);
    },
    // just bind data once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!invoiceLoading) {
      bindInvoiceData();
    }
  }, [bindInvoiceData, invoiceLoading]);

  /**
   * Handler saving data to Firestore
   */
  const updateDataToFirestore = useCallback(
    () => {
      firebase
        .firestore()
        .collection('invoices')
        .doc(invoiceId)
        .update({
          amount: amountValue,
          discount: discountValue,
          invoiceContent: invoiceContentValue,
          invoiceName: invoiceNameValue,
          isChangeRequest: isChangeRequestValue,
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
      discountValue,
      firebase,
      hideModal,
      invoiceContentValue,
      invoiceId,
      invoiceNameValue,
      isChangeRequestValue,
      sendOnValue,
      taxValue,
    ],
  );

  const updateInvoiceHandler = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      updateDataToFirestore();

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
      updateDataToFirestore,
    ],
  );

  const cancelInvoiceUpdate = useCallback(
    () => {
      resetAmount();
      resetDiscount();
      resetInvoiceContent();
      resetInvoiceName();
      resetIsChangeRequest();
      resetSendOn();
      resetTax();
      hideModal();
    },
    [
      hideModal,
      resetAmount,
      resetDiscount,
      resetInvoiceContent,
      resetInvoiceName,
      resetIsChangeRequest,
      resetSendOn,
      resetTax,
    ],
  );

  return invoiceLoading ? (
    <>
      Loading...
    </>
  ) : (
    <>
      {invoiceError ? `${invoiceError}` : null}
      <Modal
        backdrop="static"
        keyboard={false}
        onHide={hideModal}
        show={isModalDisplayed}
        size="lg"
      >
        <Form onSubmit={updateInvoiceHandler}>
          <Modal.Header closeButton>
            <Modal.Title>Invoice Update</Modal.Title>
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
                  checked={isChangeRequestValue === CR_ON}
                />
              </Col>
            </Row>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>

            <Button variant="outline-secondary" onClick={cancelInvoiceUpdate}>
              Cancel Update
            </Button>
          </Modal.Footer>

        </Form>
      </Modal>
    </>
  );
}

export default UpdateInvoiceForm;
