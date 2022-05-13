import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/**
 * Component to demonstrate the style guidelines
 * @returns {JSX.Element}
 */
function StyleGuidelines() {
  return (
    <article className="style-guidelines page-container">
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tincidunt tellus a mollis pretium. Fusce lorem risus, vehicula euismod posuere non,
        tincidunt sed libero. Nulla facilisi. Etiam pellentesque egestas enim sit amet sagittis. Donec rhoncus ipsum vel libero facilisis efficitur. Nulla et
        nisi gravida, bibendum odio in, porta tellus. Curabitur orci nunc, varius sit amet magna sit amet, eleifend ornare sapien. Morbi imperdiet
        ullamcorper dui, id facilisis ante vehicula ac. Proin posuere dolor et orci maximus viverra. Sed pellentesque arcu eget arcu convallis, fermentum
        scelerisque enim mollis.
      </p>

      <p>
        Phasellus tristique turpis a leo maximus, vel mollis eros placerat. Etiam luctus ex libero, quis venenatis leo euismod id. Nam finibus ac erat sed
        tincidunt. Donec sed mi quis risus sodales feugiat vel et nisl. Mauris fermentum justo ut lorem dignissim, ut tempor dolor sollicitudin. Integer quis
        sem euismod, vestibulum turpis a, viverra purus. Curabitur volutpat consectetur risus ac cursus. In iaculis ex ut consectetur pharetra. Pellentesque
        scelerisque neque et augue lobortis cursus. In id lectus consectetur, sollicitudin metus a, tincidunt ipsum. Suspendisse euismod aliquet diam eget
        efficitur. Sed ac auctor nisi. Fusce posuere est a diam viverra euismod. Duis sodales risus non nisl pulvinar, vitae bibendum sapien mattis.
      </p>

      <Form>
        <Form.Group className="input-group mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control placeholder="Username" type="text" />
        </Form.Group>

        <Form.Group className="input-group mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control placeholder="Phone" type="phone" />
        </Form.Group>

        <Form.Group className="input-group mb-3">
          <Form.Label>Textarea</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Textarea" />
        </Form.Group>

        <Button size="lg" type="submit">Submit</Button>
      </Form>
    </article>
  );
}

export default StyleGuidelines;
