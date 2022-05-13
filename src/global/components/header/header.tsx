import './header.scss';

import { useCallback, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Firebase } from '../../models/firebase';
import { CompanyContext } from '../../utils/company-context';
import useRoleCompany from '../../utils/use-role-company';
import { UserContext } from '../../utils/user-context';

export interface Props {
  firebase: Firebase;
}

/**
 * Global - Header component
 * @returns {JSX.Element}
 */
function Header({ firebase }: Props): JSX.Element {
  const { userId } = useContext(UserContext);
  const { addCompanyToContext } = useContext(CompanyContext);

  const companyList = useRoleCompany(userId);

  const handleSelectCompany = useCallback(
    (eventKey: any) => {
      addCompanyToContext(eventKey);
    },
    [addCompanyToContext],
  );

  return (
    <Navbar expand="lg" variant="light" bg="light">

      <Container className="header-container">

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#/project/list">PROJECTS</Nav.Link>
            <Nav.Link href="#/client/list">CLIENTS</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end">
          <NavDropdown title="COMPANIES" id="company-nav-dropdown" onSelect={handleSelectCompany}>
            {companyList ?
              companyList.map((company) => (
                <NavDropdown.Item
                  eventKey={company.id}
                  key={company.id}
                  href="#/project/list"
                >
                  {company.name}
                </NavDropdown.Item>
              )) :
              null}
          </NavDropdown>

          <Nav.Link
            href="#"
            onClick={() => {
              firebase.auth().signOut();
            }}
          >
            Sign out
          </Nav.Link>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default Header;
