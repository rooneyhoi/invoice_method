import '../../../global/form.scss';
import 'react-datepicker/dist/react-datepicker.css';

import { FormEvent, useCallback, useContext, useMemo } from 'react';
import { Col, FloatingLabel } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import DatePicker from 'react-datepicker';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';

import { CurrencyList } from '../../../global/models/dtos/default-dto';
import { Firebase } from '../../../global/models/firebase';
import { convertFirebaseTime } from '../../../global/utils/converter';
import { NET_PAYMENT } from '../../../global/utils/global-settings';
import { log } from '../../../global/utils/logger';
import { ModalContext } from '../../../global/utils/modal-context';
import useInput, { isNotEmpty, isNumber } from '../../../global/utils/use-input';
import InvoiceInformation from '../invoice-info/invoice-information';
import InvoiceSubTotal from '../invoice-print/invoice-subTotal';

interface Props {
  firebase: Firebase;
  invoiceId: string;
  projectId: string;
}

/**
 * NewInvoiceForm
 * @param {Props} props: input properties
 * @returns {JSX.Element}
 */
function PaidInvoiceForm({ firebase, invoiceId, projectId }: Props): JSX.Element {
  const { isModalDisplayed, hideModal } = useContext(ModalContext);

  const [projectValue, projectLoading, projectError] = useDocumentOnce(
    firebase.firestore().doc(`projects/${projectId}`),
  );
  const projectObj = useMemo(() => projectValue?.data(), [projectValue]);

  const [invoiceValue, invoiceLoading, invoiceError] = useDocumentOnce(
    firebase.firestore().doc(`invoices/${invoiceId}`),
  );
  const invoiceObj = useMemo(() => invoiceValue?.data(), [invoiceValue]);
  const SEND_ON = invoiceObj?.sendOn ? convertFirebaseTime(invoiceObj.sendOn) : '';

  const {
    reset: resetPaidDate,
    dateValue: paidDateValue,
    valueDateHandler: paidDateChangeHandler,
  } = useInput(isNotEmpty);

  const {
    hasError: amountHasError,
    reset: resetAmount,
    value: amountValue,
    valueChangeHandler: amountChangeHandler,
  } = useInput(isNumber);

  const {
    reset: resetCurrency,
    value: currencyValue,
    valueSelectHandler: currencySelectHandler,
  } = useInput(isNotEmpty);

  const updateDataToFirestore = useCallback(
    () => {
      firebase
        .firestore()
        .collection('invoices')
        .doc(invoiceId)
        .update({
          paidAmount: amountValue,
          paidOn: paidDateValue,
          paidCurrency: currencyValue,
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
      currencyValue,
      firebase,
      hideModal,
      invoiceId,
      paidDateValue,
    ],
  );

  const updateInvoicePayment = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      updateDataToFirestore();

      resetPaidDate();
      resetAmount();
      resetCurrency();
    },
    [
      resetAmount,
      resetCurrency,
      resetPaidDate,
      updateDataToFirestore,
    ],
  );

  return invoiceLoading || projectLoading ? (
    <>
      Loading...
    </>
  ) : (
    <>
      {projectError ? `${projectError}` : null}
      {invoiceError ? `${invoiceError}` : null}

      <Modal
        backdrop="static"
        keyboard={false}
        onHide={hideModal}
        show={isModalDisplayed}
        size="lg"
      >
        <Form onSubmit={updateInvoicePayment}>
          <Modal.Header closeButton>
            <Modal.Title>Add Payment</Modal.Title>
          </Modal.Header>

          <Modal.Body className="show-grid">

            <InvoiceInformation
              invoiceName={invoiceObj?.invoiceName}
              netPayment={NET_PAYMENT}
              projectName={projectObj?.projectName}
              sendOn={SEND_ON}
            />

            <InvoiceSubTotal
              amount={invoiceObj?.amount}
              discount={invoiceObj?.discount}
              currency={projectObj?.currency}
              tax={invoiceObj?.tax}
              hideLabel
            />

            <Row className="g-1">
              <Form.Group className="input-group mb-3">
                <Form.Label>DATE PAID</Form.Label>
                <DatePicker
                  onChange={paidDateChangeHandler}
                  required
                  selected={paidDateValue}
                  wrapperClassName="date-picker"
                />
              </Form.Group>
            </Row>

            <Row className="g-2">
              <Col md>
                <Form.Group
                  className={`input-group ${
                    amountHasError ? 'border-danger' : 'mb-3'
                  }`}
                >
                  <Form.Label>AMOUNT RECEIVED</Form.Label>
                  <Form.Control
                    onChange={amountChangeHandler}
                    placeholder="0"
                    type="number"
                    required
                    value={amountValue}
                  />
                </Form.Group>
              </Col>

              <Col md>
                <FloatingLabel controlId="floatingSelectGrid" label="CURRENCY">
                  <Form.Select
                    aria-label="Default select"
                    onChange={currencySelectHandler}
                  >
                    <option>Select</option>
                    {CurrencyList.map((currency) => (
                      <option
                        key={currency.currencyAcronym}
                        value={currency.currencyAcronym}
                      >
                        {currency.currencyName}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" type="submit">
              SAVE PAYMENT
            </Button>
          </Modal.Footer>

        </Form>
      </Modal>
    </>
  );
}

export default PaidInvoiceForm;
