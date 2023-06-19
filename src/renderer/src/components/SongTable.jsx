import { Container, Table } from "react-bootstrap";

export default function SongTable({ nameToFilenamesMapping, keyVal }) {
  return (
    <Container>
      <Table key={keyVal} striped bordered hover>
        <thead>
          <tr>
            <th>Spotify Song Name</th>
            <th>File Song Name</th>
          </tr>
        </thead>
        <tbody>
          {nameToFilenamesMapping.map((names, i) => (
            <tr key={i}>
              <td>{names[0]}</td>
              <td>{names[1]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
