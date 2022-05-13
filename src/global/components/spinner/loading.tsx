import './loading.scss';

import Spinner from 'react-bootstrap/Spinner';

interface Props {
  loadingMessage: string;
}

/**
 * Global - Loading component
 * @returns {JSX.Element}
 */
function Loading({ loadingMessage } : Props): JSX.Element {
  const message = loadingMessage || 'Loading...';

  return (
    <>
      <div className="loading-container">
        <div className="spinner-area">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
        <div className="message-area">
          <p>{message}</p>
        </div>
      </div>
    </>
  );
}

export default Loading;
