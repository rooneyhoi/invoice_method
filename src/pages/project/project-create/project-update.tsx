import '../../../global/form.scss';
import 'react-datepicker/dist/react-datepicker.css';

import { FormEvent, useCallback, useContext, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import DatePicker from 'react-datepicker';
import { useCollection } from 'react-firebase-hooks/firestore';

import { CurrencyList } from '../../../global/models/dtos/default-dto';
import { ProjectStatus } from '../../../global/models/dtos/project-dto';
import { Firebase } from '../../../global/models/firebase';
import { log } from '../../../global/utils/logger';
import { ModalContext } from '../../../global/utils/modal-context';
import useInput, { isNotEmpty, isNumber } from '../../../global/utils/use-input';

interface Props {
  firebase: Firebase;
  currentCompanyId: string;
  projectId: string;
}

/**
 * UpdateProjectForm
 * @param {Props} props: input properties
 * @returns {JSX.Element}
 */
function UpdateProjectForm({ firebase, currentCompanyId, projectId }: Props): JSX.Element {
  const { isModalDisplayed, hideModal } = useContext(ModalContext);

  const [clientValue, clientError] = useCollection(
    firebase.firestore().collection('clients').where('parentCompanyId', '==', currentCompanyId),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );
  const clientList = useMemo(() => clientValue?.docs, [clientValue]);

  const [companyValue, companyError] = useCollection(
    firebase.firestore().collection('companies').where('parentCompanyId', '==', currentCompanyId),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );
  const companyList = useMemo(() => companyValue?.docs, [companyValue]);

  const {
    reset: resetClientID,
    value: clientIDValue,
    valueSelectHandler: clientIDSelectHandler,
  } = useInput(isNotEmpty);

  const {
    hasError: projectNameHasError,
    reset: resetProjectName,
    value: projectNameValue,
    valueChangeHandler: projectNameChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetEstimationURL,
    value: estimationURLValue,
    valueChangeHandler: estimationURLChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetPONumber,
    value: PONumberValue,
    valueChangeHandler: PONumberChangeHandler,
  } = useInput(isNotEmpty);

  const {
    hasError: budgetHasError,
    reset: resetBudget,
    value: budgetValue,
    valueChangeHandler: budgetChangeHandler,
  } = useInput(isNumber);

  const {
    reset: resetCurrency,
    value: currencyValue,
    valueSelectHandler: currencySelectHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetPayableTo,
    value: payableToValue,
    valueSelectHandler: payableToSelectHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetCurrencyAccount,
    value: currencyAccountValue,
    valueSelectHandler: currencyAccountSelectHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetStartDate,
    dateValue: startDateValue,
    valueDateHandler: startDateChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetDeliveryDate,
    dateValue: deliveryDateValue,
    valueDateHandler: deliveryDateChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetIsTaxableRate,
    value: isTaxableRateValue,
    valueChangeHandler: isTaxableRateChangeHandler,
  } = useInput(isNotEmpty);

  const selectedClient = clientList?.find(({ id }) => id === clientIDValue);

  // Get list of currency account (bank account) by selected payable company
  const [currencyAccValue, currencyAccError] = useCollection(
    firebase.firestore().collection('banks').where('companyId', '==', payableToValue),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );
  const currencyAccList = useMemo(() => currencyAccValue?.docs, [currencyAccValue]);

  /**
   * Handler saving data to Firestore
   * @param {()} successCallback function
   */
  const saveDataToFirestore = useCallback((projectStatus: ProjectStatus) => {
    firebase
      .firestore()
      .collection('projects')
      .doc(projectId)
      .update({
        budget: budgetValue,
        clientId: clientIDValue,
        clientName: selectedClient?.data().name,
        companyId: payableToValue,
        currency: currencyValue,
        currencyAccount: currencyAccountValue,
        deliveryDate: deliveryDateValue,
        estimationURL: estimationURLValue,
        isTaxable: isTaxableRateValue,
        payableTo: payableToValue,
        PONumber: PONumberValue,
        parentCompanyId: currentCompanyId,
        projectName: projectNameValue,
        startDate: startDateValue,
        status: projectStatus,
      })
      .then((docRef) => {
        hideModal();
      })
      .catch((error) => {
        log(error);
      });
  }, [
    firebase,
    budgetValue,
    clientIDValue,
    currentCompanyId,
    currencyAccountValue,
    currencyValue,
    deliveryDateValue,
    estimationURLValue,
    isTaxableRateValue,
    payableToValue,
    PONumberValue,
    projectNameValue,
    projectId,
    selectedClient,
    startDateValue,
    hideModal,
  ]);

  const createNewProjectHandler = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const projectStatus = 'Active - In Production';
      saveDataToFirestore(projectStatus);

      resetBudget();
      resetClientID();
      resetCurrency();
      resetCurrencyAccount();
      resetDeliveryDate();
      resetEstimationURL();
      resetIsTaxableRate();
      resetPayableTo();
      resetPONumber();
      resetProjectName();
      resetStartDate();
    },
    [
      resetBudget,
      resetClientID,
      resetCurrency,
      resetCurrencyAccount,
      resetDeliveryDate,
      resetEstimationURL,
      resetIsTaxableRate,
      resetPayableTo,
      resetPONumber,
      resetProjectName,
      resetStartDate,
      saveDataToFirestore,
    ],
  );

  return (
    <>
      {clientError ? `${clientError}` : null}
      {companyError ? `${companyError}` : null}
      {currencyAccError ? `${currencyAccError}` : null}

      <Modal
        backdrop="static"
        keyboard={false}
        onHide={hideModal}
        show={isModalDisplayed}
        size="lg"
      >
        <Form onSubmit={createNewProjectHandler}>

          <Modal.Header closeButton>
            <Modal.Title>Project Information</Modal.Title>
          </Modal.Header>

          <Modal.Body className="show-grid">
            <Row className="g-3">
              <FloatingLabel controlId="floatingSelectGrid" label="CLIENT">
                <Form.Select
                  aria-label="Default select"
                  onChange={clientIDSelectHandler}
                  required
                >
                  <option value="">Select client</option>
                  {clientList ?
                    clientList.map((client) => (
                      <option
                        value={client.id}
                        key={client.id}
                      >
                        {client.data().name}
                      </option>
                    )) : null}
                </Form.Select>
              </FloatingLabel>
            </Row>

            <Row className="g-1">
              <Col md>
                <Form.Group
                  className={`input-group ${
                    projectNameHasError ? 'border-danger' : 'mb-3'
                  }`}
                >
                  <Form.Label>PROJECT NAME</Form.Label>
                  <Form.Control
                    onChange={projectNameChangeHandler}
                    placeholder="Project full name"
                    required
                    type="text"
                    value={projectNameValue}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-2">
              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>ESTIMATION URL</Form.Label>
                  <Form.Control
                    onChange={estimationURLChangeHandler}
                    placeholder="Estimation URL"
                    type="text"
                    value={estimationURLValue}
                  />
                </Form.Group>
              </Col>

              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>PO NUMBER</Form.Label>
                  <Form.Control
                    onChange={PONumberChangeHandler}
                    placeholder="ie. PO92928192"
                    type="text"
                    value={PONumberValue}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-2">
              <Col md>
                <Form.Group
                  className={`input-group ${
                    budgetHasError ? 'border-danger' : 'mb-3'
                  }`}
                >
                  <Form.Label>STANDARD HOURLY RATE</Form.Label>
                  <Form.Control
                    onChange={budgetChangeHandler}
                    placeholder="0"
                    type="number"
                    required
                    value={budgetValue}
                  />
                </Form.Group>
              </Col>

              <Col md>
                <FloatingLabel controlId="floatingSelectGrid" label="CURRENCY">
                  <Form.Select
                    aria-label="Default select"
                    onChange={currencySelectHandler}
                  >
                    <option>Select currency</option>
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

            <Row className="g-2">
              <Col md>
                <FloatingLabel
                  controlId="floatingSelectGrid"
                  label="PAYABLE TO"
                >
                  <Form.Select
                    aria-label="Default select"
                    onChange={payableToSelectHandler}
                    required
                  >
                    <option value="">Select company</option>
                    {companyList ?
                      companyList.map((payableCompany: any) => (
                        <option
                          value={payableCompany.id}
                          key={payableCompany.id}
                        >
                          {payableCompany.data().name}
                        </option>
                      )) : null}
                  </Form.Select>
                </FloatingLabel>
              </Col>

              <Col md>
                <FloatingLabel controlId="floatingSelectGrid" label="ACCOUNT">
                  <Form.Select
                    aria-label="Default select"
                    onChange={currencyAccountSelectHandler}
                    required
                  >
                    <option value="">Select currency account</option>
                    {currencyAccList ?
                      currencyAccList.map((currencyAccount: any) => (
                        <option
                          value={currencyAccount.id}
                          key={currencyAccount.id}
                        >
                          {currencyAccount.data().accountCurrency}
                        </option>
                      )) : null}
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>

            <Row className="g-2">
              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>START DATE</Form.Label>
                  <DatePicker
                    onChange={startDateChangeHandler}
                    required
                    selected={startDateValue}
                    wrapperClassName="date-picker"
                  />
                </Form.Group>
              </Col>

              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>DELIVERY DATE</Form.Label>
                  <DatePicker
                    onChange={deliveryDateChangeHandler}
                    required
                    selected={deliveryDateValue}
                    wrapperClassName="date-picker"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md>
                <Form.Check
                  type="checkbox"
                  id="IsTaxRate"
                  label="Project is taxable at the standard client rate."
                  onChange={isTaxableRateChangeHandler}
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

export default UpdateProjectForm;
