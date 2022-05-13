import { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

interface Props {
  onChangeFilter: (selectedCompany: string) => void;
}

/**
 * ClientFilter
 * @param {Props} props input props
 * @returns {JSX.Element}
 */
function ClientFilter(props: Props): JSX.Element {
  const dropdownChangeHandler = useCallback((event: any) => {
    props.onChangeFilter(event);
  }, [props]);

  return (
    <ButtonGroup>
      <Button>PROJECTS</Button>
      <Button>CLIENTS</Button>

      <DropdownButton as={ButtonGroup} title="COMPANIES" id="bg-nested-dropdown" onSelect={dropdownChangeHandler}>
        <Dropdown.Item eventKey="1">Adaptis GmbH</Dropdown.Item>
        <Dropdown.Item eventKey="2">MIS Global</Dropdown.Item>
        <Dropdown.Item eventKey="3">8Solvers Pte</Dropdown.Item>
      </DropdownButton>
    </ButtonGroup>
  );
}

export default ClientFilter;
