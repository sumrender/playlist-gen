import { Button, Card } from "react-bootstrap";
import { fetchDataFromElectron } from "../utils/misc";
export default function PlaylistCard({ playlist, bg = "primary" }) {
  const { name, owner, public: isPublic, tracks, external_urls } = playlist;
  function openUrl(url) {
    fetchDataFromElectron("open-url", url);
  }
  return (
    <Card bg={bg} text="light" className="mb-3 col-lg-6">
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle>Owner: {owner.display_name}</Card.Subtitle>
        <Card.Text>Public: {isPublic ? "Yes" : "No"}</Card.Text>
        <Card.Text>Total Tracks: {tracks.total}</Card.Text>
        <Button
          variant="outline-light"
          onClick={() => openUrl(external_urls.spotify)}
        >
          Open in spotify
        </Button>
      </Card.Body>
    </Card>
  );
}
