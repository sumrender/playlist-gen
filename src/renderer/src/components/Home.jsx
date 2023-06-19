import { Accordion, Container } from "react-bootstrap";
import Profile from "./Profile";
import Playlists from "./Playlists";
import SearchTracks from "./SearchTracks";
import AddDeviceSongsToPlaylist from "./AddDeviceSongsToPlaylist";
import ShowPrevPlaylists from "./ShowPrevPlaylists";

export default function Home({ token }) {
  return (
    <Container>
      <Accordion defaultActiveKey="3" className="mt-3">
        {/* User details */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>User Details</Accordion.Header>
          <Accordion.Body>
            <Profile token={token} />
          </Accordion.Body>
        </Accordion.Item>
        {/* User's Playlists */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>Your Playlists</Accordion.Header>
          <Accordion.Body>
            <Playlists token={token} />
          </Accordion.Body>
        </Accordion.Item>
        {/* Search song */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>Search Song</Accordion.Header>
          <Accordion.Body>
            <SearchTracks token={token} />
          </Accordion.Body>
        </Accordion.Item>
        {/* Add songs to playlist from device: */}
        <Accordion.Item eventKey="3">
          <Accordion.Header className="bg-success">
            <p>Add songs to playlist from device:</p>
          </Accordion.Header>
          <Accordion.Body>
            <AddDeviceSongsToPlaylist token={token} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header className="bg-success">
            <p>Playlists created using Playlist Generator</p>
          </Accordion.Header>
          <Accordion.Body>
            <ShowPrevPlaylists />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
