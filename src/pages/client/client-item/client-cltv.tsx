interface Props {
  id: string;
}

/**
 * Client - CLTV
 * @param {Props} props input props
 * @returns {JSX.Element}
 */
function CLTV({ id }: Props): JSX.Element {
  return (
    <div>
      <span>CLTV: $10000</span>
    </div>
  );
}

export default CLTV;
