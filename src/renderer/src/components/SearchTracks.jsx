import { useState } from "react";
import { Col, Button, Container, Spinner, Alert } from "react-bootstrap";
import { handleSearch } from "../utils/spotifyFunctions";

export default function SearchTracks({ token }) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleQueryChange(e) {
    setMessage("");
    setQuery(e.target.value);
  }

  async function search() {
    setMessage("");
    setLoading(true);
    try {
      const searchResults = await handleSearch(token, query);
      if (searchResults.length === 0) {
        setMessage("No songs found");
      }
      setTracks(searchResults);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <Col className="d-flex justify-content-center">
        <input type="text" onChange={(e) => handleQueryChange(e)} />
        <Button className="ms-3" variant="primary" onClick={search}>
          {loading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <>Search</>
          )}
        </Button>
      </Col>
      <hr />
      <Container>
        {message && <Alert variant="warning">{message}</Alert>}
        {tracks.map((track) => {
          return (
            <Container key={track.uri} className="p-3">
              <Col className="d-flex justify-content-between">
                <Col className="text-center col-lg-3">
                  <img
                    height="100px"
                    src={track.album.images[0].url}
                    alt={track.album.name}
                  />
                  <audio controls className="mt-3" style={{ width: "250px" }}>
                    <source src={track.preview_url} type="audio/mp3" />
                  </audio>
                </Col>
                <Col className="d-flex flex-column align-items-center">
                  <Col className="col-6">
                    <h2>{track.name}</h2>
                    <p style={{ marginTop: "-5px" }}>
                      Artist: {track.artists[0].name}
                    </p>
                    <p style={{ marginTop: "-15px" }}>
                      Album: {track.album.name}
                    </p>
                    {/* <Button
                            variant="primary"
                            size="sm"
                            onClick={() => addSongToPlaylist(track.uri)}
                          >
                            Add to Test playlist
                          </Button> */}
                  </Col>
                </Col>
              </Col>
              <hr />
            </Container>
          );
        })}
      </Container>
    </>
  );
}
