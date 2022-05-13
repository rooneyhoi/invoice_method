import '../../../global/form.scss';
import 'react-datepicker/dist/react-datepicker.css';

import emailjs from 'emailjs-com';
import { FormEvent, useCallback, useContext, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';

import Loading from '../../../global/components/spinner/loading';
import { Firebase } from '../../../global/models/firebase';
import {
  EMAILJS_FROM_NAME,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_USER_ID,
} from '../../../global/services/email-config';
import { log } from '../../../global/utils/logger';
import { ModalContext } from '../../../global/utils/modal-context';
import useInput, { isEmail, isNotEmpty } from '../../../global/utils/use-input';

interface Props {
  firebase: Firebase;
  projectId: string;
  dataURL: string;
}

const SEND_EMAIL_STATUS = 'Email is sending to client...';

/**
 * NewInvoiceForm
 * @param {Props} props: input properties
 * @returns {JSX.Element}
 */
function SendInvoiceForm({ firebase, projectId, dataURL }: Props): JSX.Element {
  const { isModalDisplayed, hideModal } = useContext(ModalContext);
  const [sending, setSending] = useState(false);

  const [projectValue, projectLoading, projectError] = useDocumentOnce(
    firebase.firestore().doc(`projects/${projectId}`),
  );
  const projectObj = useMemo(() => projectValue?.data(), [projectValue]);
  const clientName = projectObj?.clientName ? projectObj?.clientName : '';

  const {
    hasError: invoiceEmailHasError,
    inputBlurHandler: invoiceEmailBlurHandler,
    reset: resetInvoiceEmail,
    value: invoiceEmailValue,
    valueChangeHandler: invoiceEmailChangeHandler,
  } = useInput(isEmail);

  const {
    inputBlurHandler: invoiceEmailContentBlurHandler,
    reset: resetInvoiceEmailContent,
    value: invoiceEmailContentValue,
    valueChangeHandler: invoiceEmailContentChangeHandler,
  } = useInput(isNotEmpty);

  const sendInvoiceToEmail = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      const emailTemplateParams = {
        from_name: EMAILJS_FROM_NAME,
        to_name: clientName,
        to_email: invoiceEmailValue,
        message: invoiceEmailContentValue,
        content: dataURL,
      };

      log(emailTemplateParams);
      setSending(true);

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailTemplateParams, EMAILJS_USER_ID)
        .then((result) => {
          log(`Succeed: ${result.text}`);
          setSending(false);
          hideModal();
        }, (error) => {
          log(`Err: ${error.text}`);
        });

      resetInvoiceEmail();
      resetInvoiceEmailContent();
    },
    [clientName, dataURL, hideModal, invoiceEmailContentValue, invoiceEmailValue, resetInvoiceEmail, resetInvoiceEmailContent],
  );

  return projectLoading ? (
    <>
      Loading...
    </>
  ) : (
    <>
      {projectError || null}
      <Modal
        backdrop="static"
        keyboard={false}
        onHide={hideModal}
        show={isModalDisplayed}
        size="lg"
      >
        { sending ? <Loading loadingMessage={SEND_EMAIL_STATUS} /> : (
          <Form onSubmit={sendInvoiceToEmail}>
            <Modal.Header closeButton>
              <Modal.Title>Send Invoice</Modal.Title>
            </Modal.Header>

            <Modal.Body className="show-grid">

              <p>To send to multiple people use a comma between the email address</p>

              <Row className="g-1">
                <Form.Group
                  className={`input-group ${invoiceEmailHasError ? 'border-danger' : 'mb-3'}`}
                >
                  <Form.Label>EMAILS</Form.Label>
                  <Form.Control
                    onBlur={invoiceEmailBlurHandler}
                    onChange={invoiceEmailChangeHandler}
                    placeholder="client@email.com"
                    required
                    type="text"
                    value={invoiceEmailValue}
                  />
                </Form.Group>
                {invoiceEmailHasError ? (
                  <p className="text-danger mb-3">Please input correct email</p>
                ) : null}
              </Row>

              <Row className="g-1">
                <Form.Group className="input-group mb-3">
                  <Form.Label>EMAIL MESSAGE</Form.Label>
                  <Form.Control
                    as="textarea"
                    onBlur={invoiceEmailContentBlurHandler}
                    onChange={invoiceEmailContentChangeHandler}
                    placeholder="ie. 40 hours"
                    required
                    style={{ height: '200px' }}
                    value={invoiceEmailContentValue}
                  />
                </Form.Group>
              </Row>

            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" type="submit">
                SEND INVOICE
              </Button>
            </Modal.Footer>

          </Form>
        )}
      </Modal>
    </>
  );
}

export default SendInvoiceForm;
