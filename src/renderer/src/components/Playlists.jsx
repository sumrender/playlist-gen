import { Card, Container } from "react-bootstrap";
import PlaylistCard from "./PlaylistCard";
import { fetchPlaylists } from "../utils/spotifyFunctions";
import { useEffect, useState } from "react";

const Playlists = ({ token }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    async function loadPlaylists() {
      const data = await fetchPlaylists(token);
      setPlaylists(data);
    }
    loadPlaylists();
  }, []);

  let colorIndex = 0;
  const colorClasses = [
    "success",
    "danger",
    "info",
    "warning",
    "primary",
    "secondary",
    "dark",
  ];

  return (
    <Container className="">
      {playlists.map((playlist) => {
        colorIndex = (colorIndex + 1) % colorClasses.length;
        return (
          <Container key={playlist.id}>
            <PlaylistCard playlist={playlist} bg={colorClasses[colorIndex]} />
          </Container>
        );
      })}
    </Container>
  );
};

export default Playlists;
