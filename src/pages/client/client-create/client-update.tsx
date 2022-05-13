import { FormEvent, useCallback, useContext, useEffect, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useCollectionOnce, useDocumentOnce } from 'react-firebase-hooks/firestore';

import { ClientDTO } from '../../../global/models/dtos/client-dto';
import { CurrencyList } from '../../../global/models/dtos/default-dto';
import { Firebase } from '../../../global/models/firebase';
import { DEFAULT_CLIENT_STATUS, ZERO_VALUE } from '../../../global/utils/global-settings';
import { ModalContext } from '../../../global/utils/modal-context';
import useInput from '../../../global/utils/use-input';
import { isEmail, isNotEmpty, isNumber } from '../client-state/client-actions';

interface Props {
  firebase: Firebase;
  currentCompanyId: string;
  clientId: string;
}

const DEFAULT_NET_PAYMENT = 15;

const ClientItem: ClientDTO = {
  abbreviation: '',
  address: '',
  ccEmail: '',
  city: '',
  companyId: '',
  country: '',
  currency: '',
  currencyAccount: '',
  currentStatus: DEFAULT_CLIENT_STATUS,
  hourRate: ZERO_VALUE,
  id: '',
  invoiceEmail: '',
  legalName: '',
  name: '',
  netPayment: ZERO_VALUE,
  parentCompanyId: '',
  payableTo: '',
  representativeName: '',
  state: '',
  taxRate: ZERO_VALUE,
  telephone: '',
  zipCode: '',
};

/**
 * UpdateClientForm
 * @param {Props} props: input properties
 * @returns {JSX.Element}
 */
function UpdateClientForm({ firebase, currentCompanyId, clientId }: Props): JSX.Element {
  const { isModalDisplayed, hideModal } = useContext(ModalContext);

  // Get all available countries
  const [countryListValue] = useCollectionOnce(
    firebase.firestore().collection('countries'),
  );
  const countryList = useMemo(() => countryListValue?.docs, [countryListValue]);

  // Get all child companies base on current selected company
  const [companyValue] = useCollectionOnce(
    firebase.firestore().collection('companies').where('parentCompanyId', '==', currentCompanyId),
  );
  const companyList = useMemo(() => companyValue?.docs, [companyValue]);

  const [clientValue, clientLoading, clientError] = useDocumentOnce(
    firebase.firestore().doc(`clients/${clientId}`),
  );
  const clientObj = useMemo(() => clientValue?.data(), [clientValue]);

  if (clientObj) {
    ClientItem.abbreviation = clientObj.abbreviation;
    ClientItem.address = clientObj.address;
  }

  const {
    reset: resetClientName,
    value: clientNameValue,
    valueChangeHandler: clientNameChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetLegalName,
    value: legalNameValue,
    valueChangeHandler: legalNameChangeHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetAbbreviation,
    value: abbreviationValue,
    valueChangeHandler: abbreviationChangeHandler,
    valueInitHandler: abbreviationInitHandler,
  } = useInput(isNotEmpty);

  const {
    reset: resetAddress,
    value: addressValue,
    valueChangeHandler: addressChangeHandler,
    valueInitHandler: addressInitHandler,
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
    reset: resetTaxRate,
    value: taxRateValue,
    valueChangeHandler: taxRateChangeHandler,
  } = useInput(isNumber);

  const {
    reset: resetCurrentStatus,
    value: currentStatusValue,
    valueSelectHandler: currentStatusSelectHandler,
  } = useInput(isNotEmpty);

  // Get list of currency account (bank account) by selected payable company
  const [currencyAccValue] = useCollectionOnce(
    firebase.firestore().collection('banks').where('companyId', '==', payableToValue),
  );
  const currencyAccList = useMemo(() => currencyAccValue?.docs, [currencyAccValue]);

  const bindClientData = useCallback(
    () => {
      abbreviationInitHandler(ClientItem.abbreviation);
      addressInitHandler(ClientItem.address);
    },
    // just need to bind data once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!clientLoading) {
      bindClientData();
    }
  }, [bindClientData, clientLoading]);

  /**
   * Handler saving data to Firestore
   * @param {()} successCallback function
   */
  const saveDataToFirestore = useCallback(() => {
    firebase
      .firestore()
      .collection('clients')
      .doc(clientId)
      .update({
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
    clientId,
    countryValue,
    currencyAccountValue,
    currencyValue,
    currentStatusValue,
    firebase,
    hideModal,
    hourRateValue,
    invoiceEmailValue,
    legalNameValue,
    payableToValue,
    representativeNameValue,
    stateValue,
    taxRateValue,
    telephoneValue,
    zipCodeValue,
  ]);

  const updateClientHandler = useCallback(
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
      {clientError && null}

      <Modal
        backdrop="static"
        keyboard={false}
        onHide={hideModal}
        show={isModalDisplayed}
        size="lg"
      >
        <Form onSubmit={updateClientHandler}>

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

export default UpdateClientForm;
