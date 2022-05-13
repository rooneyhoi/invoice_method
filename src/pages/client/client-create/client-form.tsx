import { FormEvent, useCallback, useContext, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useCollection, useCollectionOnce } from 'react-firebase-hooks/firestore';

import { CurrencyList } from '../../../global/models/dtos/default-dto';
import { Firebase } from '../../../global/models/firebase';
import { ModalContext } from '../../../global/utils/modal-context';
import useInput from '../../../global/utils/use-input';
import { isEmail, isNotEmpty, isNumber } from '../client-state/client-actions';

interface Props {
  firebase: Firebase;
  currentCompanyId: string;
}

const DEFAULT_NET_PAYMENT = 15;

/**
 * NewClientForm
 * @param {Props} props: input properties
 * @returns {JSX.Element}
 */
function NewClientForm({ firebase, currentCompanyId }: Props): JSX.Element {
  const { isModalDisplayed, hideModal } = useContext(ModalContext);

  const {
    hasError: clientNameHasError,
    reset: resetClientName,
    value: clientNameValue,
    valueChangeHandler: clientNameChangeHandler,
  } = useInput(isNotEmpty);

  const {
    hasError: legalNameHasError,
    reset: resetLegalName,
    value: legalNameValue,
    valueChangeHandler: legalNameChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetAbbreviation,
    value: abbreviationValue,
    valueChangeHandler: abbreviationChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetAddress,
    value: addressValue,
    valueChangeHandler: addressChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetZipCode,
    value: zipCodeValue,
    valueChangeHandler: zipCodeChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetCity,
    value: cityValue,
    valueChangeHandler: cityChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetState,
    value: stateValue,
    valueChangeHandler: stateChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetCountry,
    value: countryValue,
    valueSelectHandler: countrySelectHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetTelephone,
    value: telephoneValue,
    valueChangeHandler: telephoneChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetInvoiceEmail,
    value: invoiceEmailValue,
    valueChangeHandler: invoiceEmailChangeHandler,
  } = useInput(isEmail);

  const {
    reset: resetRepresentativeName,
    value: representativeNameValue,
    valueChangeHandler: representativeNameChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetCcEmail,
    value: ccEmailValue,
    valueChangeHandler: ccEmailChangeHandler,
  } = useInput(isEmail);

  const {
    hasError: hourRateHasError,
    reset: resetHourRate,
    value: hourRateValue,
    valueChangeHandler: hourRateChangeHandler,
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
    hasError: taxRateHasError,
    reset: resetTaxRate,
    value: taxRateValue,
    valueChangeHandler: taxRateChangeHandler,
  } = useInput(isNumber);

  const {
    reset: resetCurrentStatus,
    value: currentStatusValue,
    valueSelectHandler: currentStatusSelectHandler,
  } = useInput(isNotEmpty);

  // Get all available countries
  const [countryListValue] = useCollectionOnce(
    firebase.firestore().collection('countries'),
  );
  const countryList = useMemo(() => countryListValue?.docs, [countryListValue]);

  // Get all child companies base on current selected company
  const [companyValue, companyError] = useCollection(
    firebase.firestore().collection('companies').where('parentCompanyId', '==', currentCompanyId),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );
  const companyList = useMemo(() => companyValue?.docs, [companyValue]);

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
  const saveDataToFirestore = useCallback(() => {
    firebase
      .firestore()
      .collection('clients')
      .add({
        abbreviation: abbreviationValue,
        address: addressValue,
        ccEmail: ccEmailValue,
        city: cityValue,
        companyId: payableToValue,
        country: countryValue,
        currency: currencyValue,
        currencyAccount: currencyAccountValue,
        currentStatus: currentStatusValue,
        hourRate: hourRateValue,
        invoiceEmail: invoiceEmailValue,
        legalName: legalNameValue,
        name: clientNameValue,
        netPayment: DEFAULT_NET_PAYMENT,
        parentCompanyId: currentCompanyId,
        payableTo: payableToValue,
        representativeName: representativeNameValue,
        state: stateValue,
        taxRate: taxRateValue,
        telephone: telephoneValue,
        zipCode: zipCodeValue,
      })
      .then(hideModal);
  }, [
    abbreviationValue,
    addressValue,
    ccEmailValue,
    cityValue,
    clientNameValue,
    countryValue,
    currencyAccountValue,
    currencyValue,
    currentStatusValue,
    firebase,
    hideModal,
    hourRateValue,
    invoiceEmailValue,
    legalNameValue,
    currentCompanyId,
    payableToValue,
    representativeNameValue,
    stateValue,
    taxRateValue,
    telephoneValue,
    zipCodeValue,
  ]);

  const createNewClientHandler = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      saveDataToFirestore();

      resetAbbreviation();
      resetAddress();
      resetCcEmail();
      resetCity();
      resetClientName();
      resetCountry();
      resetCurrencyAccount();
      resetCurrency();
      resetCurrentStatus();
      resetHourRate();
      resetInvoiceEmail();
      resetLegalName();
      resetPayableTo();
      resetRepresentativeName();
      resetState();
      resetTaxRate();
      resetTelephone();
      resetZipCode();
    },
    [
      resetAbbreviation,
      resetAddress,
      resetCcEmail,
      resetCity,
      resetClientName,
      resetCountry,
      resetCurrency,
      resetCurrencyAccount,
      resetCurrentStatus,
      resetHourRate,
      resetInvoiceEmail,
      resetLegalName,
      resetPayableTo,
      resetRepresentativeName,
      resetState,
      resetTaxRate,
      resetTelephone,
      resetZipCode,
      saveDataToFirestore,
    ],
  );

  return (
    <>
      {companyError || currencyAccError ? `${companyError}` || `${currencyAccError}` : null}

      <Modal
        backdrop="static"
        keyboard={false}
        onHide={hideModal}
        show={isModalDisplayed}
        size="lg"
      >
        <Form onSubmit={createNewClientHandler}>

          <Modal.Header closeButton>
            <Modal.Title>Client Details</Modal.Title>
          </Modal.Header>

          <Modal.Body className="show-grid">

            <Row className="g-3">
              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>CLIENT NAME</Form.Label>
                  <Form.Control
                    onChange={clientNameChangeHandler}
                    placeholder="Client name"
                    required
                    type="text"
                    value={clientNameValue}
                  />
                </Form.Group>
                {clientNameHasError ? (
                  <p className="text-danger mb-3">{clientNameHasError}</p>
                ) : null}
              </Col>

              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>LEGAL TRADING NAME</Form.Label>
                  <Form.Control
                    onChange={legalNameChangeHandler}
                    placeholder="Legal trading name"
                    required
                    type="text"
                    value={legalNameValue}
                  />
                </Form.Group>
                {legalNameHasError ? (
                  <p className="text-danger mb-3">Please enter value</p>
                ) : null}
              </Col>

              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>ABBREVIATION</Form.Label>
                  <Form.Control
                    onChange={abbreviationChangeHandler}
                    placeholder="Short name"
                    type="text"
                    required
                    value={abbreviationValue}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-2">
              <Col>
                <Form.Group className="input-group mb-3">
                  <Form.Label>ADDRESS</Form.Label>
                  <Form.Control
                    onChange={addressChangeHandler}
                    placeholder="Business address"
                    type="text"
                    value={addressValue}
                  />
                </Form.Group>
              </Col>

              <Col md="auto">
                <Form.Group className="input-group mb-3">
                  <Form.Label>ZIP CODE</Form.Label>
                  <Form.Control
                    onChange={zipCodeChangeHandler}
                    placeholder="Zip code"
                    type="text"
                    value={zipCodeValue}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3">
              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>CITY</Form.Label>
                  <Form.Control
                    onChange={cityChangeHandler}
                    placeholder="City"
                    type="text"
                    value={cityValue}
                  />
                </Form.Group>
              </Col>

              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>STATE</Form.Label>
                  <Form.Control
                    onChange={stateChangeHandler}
                    placeholder="State"
                    type="text"
                    value={stateValue}
                  />
                </Form.Group>
              </Col>

              <Col md>
                <FloatingLabel controlId="floatingSelectGrid" label="COUNTRY">
                  <Form.Select aria-label="Default select" onChange={countrySelectHandler}>
                    <option value="">Select country</option>
                    {countryList ?
                      countryList.map((country: any) => (
                        <option
                          value={country.id}
                          key={country.id}
                        >
                          {country.data().name}
                        </option>
                      )) : null}
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>

            <Row className="g-2">
              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>TELEPHONE NUMBER</Form.Label>
                  <Form.Control
                    onChange={telephoneChangeHandler}
                    placeholder="Telephone"
                    type="text"
                    value={telephoneValue}
                  />
                </Form.Group>
              </Col>

              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>INVOICE EMAIL</Form.Label>
                  <Form.Control
                    onChange={invoiceEmailChangeHandler}
                    placeholder="Invoice Email"
                    required
                    type="email"
                    value={invoiceEmailValue}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-2">
              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>ATTENTION TO</Form.Label>
                  <Form.Control
                    onChange={representativeNameChangeHandler}
                    placeholder="Representative Name"
                    required
                    type="text"
                    value={representativeNameValue}
                  />
                </Form.Group>
              </Col>

              <Col md>
                <Form.Group className="input-group mb-3">
                  <Form.Label>CC EMAIL</Form.Label>
                  <Form.Control
                    onChange={ccEmailChangeHandler}
                    placeholder="CC Email"
                    required
                    type="email"
                    value={ccEmailValue}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-4">
              <Col xs={4} md={3}>
                <Form.Group className="input-group mb-3">
                  <Form.Label>STANDARD HOURLY RATE</Form.Label>
                  <Form.Control
                    onChange={hourRateChangeHandler}
                    placeholder="Hour Rate"
                    type="number"
                    value={hourRateValue}
                  />
                </Form.Group>
                {hourRateHasError ? (
                  <p className="text-danger mb-3">Please enter number value</p>
                ) : null}
              </Col>

              <Col xs={4} md={3}>
                <FloatingLabel controlId="floatingSelectGrid" label="CURRENCY">
                  <Form.Select aria-label="Default select" onChange={currencySelectHandler}>
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

              <Col xs={6} md={4}>
                <FloatingLabel controlId="floatingSelectGrid" label="PAYABLE TO">
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

              <Col xs={4} md={2}>
                <FloatingLabel controlId="floatingSelectGrid" label="ACCOUNT">
                  <Form.Select
                    aria-label="Default select"
                    onChange={currencyAccountSelectHandler}
                  >
                    <option value="">Currency</option>
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
                  <Form.Label>TAX RATE</Form.Label>
                  <Form.Control
                    onChange={taxRateChangeHandler}
                    placeholder="Tax Rate"
                    type="number"
                    value={taxRateValue}
                  />
                </Form.Group>
                {taxRateHasError ? (
                  <p className="text-danger mb-3">Please enter number value</p>
                ) : null}
              </Col>

              <Col md>
                <FloatingLabel controlId="floatingSelectGrid" label="CURRENT STATUS">
                  <Form.Select aria-label="Floating label select" onChange={currentStatusSelectHandler}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </FloatingLabel>
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

export default NewClientForm;
