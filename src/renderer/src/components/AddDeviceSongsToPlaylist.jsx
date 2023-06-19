import { useEffect, useState } from "react";
import {
  Spinner,
  Button,
  Form,
  Container,
  Alert,
  Accordion,
  Table,
  ProgressBar,
} from "react-bootstrap";
import PlaylistCard from "./PlaylistCard";
import {
  addMutltipleSongsToPlaylist,
  createPlaylist,
  fetchPlaylist,
  getSongsData,
} from "../utils/spotifyFunctions";
import { buildSongNames, fetchDataFromElectron } from "../utils/misc";
import SongTable from "./SongTable";

export default function AddDeviceSongsToPlaylist({ token }) {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [playlist, setPlaylist] = useState("");
  const [loading, setLoading] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const [songsNotFound, setSongsNotFound] = useState([]);
  const [nameToFilenamesMapping, setNameToFilenamesMapping] = useState({});

  useEffect(() => {
    async function dummyApiCall() {
      try {
        const { songUris } = await getSongsData(token, ["Stronger Kanye West"]);
      } catch (error) {
        setLoading(false);
        console.log("dummyApiCall error:", error);
      }
    }
    dummyApiCall();
  }, []);

  function updateLoading(loadingPercent) {
    setLoading(parseInt(loadingPercent));
  }

  async function handleAddSongs() {
    setLoading(1);
    try {
      const musicData = await fetchDataFromElectron("fetch-metadata");
      setLoading(15);
      console.log(musicData);
      if (!musicData || musicData.error) {
        throw new Error("addSongsFromDevice error");
      }
      const songNames = buildSongNames(musicData.metadataArray);

      const { songUris, songsNotFoundOnSpotify, songNameToFileNameMapping } =
        await getSongsData(token, songNames);
      setSongsNotFound(songsNotFoundOnSpotify);
      setNameToFilenamesMapping(songNameToFileNameMapping);

      console.log("songNameToFileNameMapping", songNameToFileNameMapping);

      const playlistId = await createPlaylist(token, newPlaylistName, isPublic);
      console.log("playlist created", playlistId);

      const n = songUris.length;
      const numOfIterations = n % 100 ? n / 100 + 1 : n / 100;
      let x = 1;
      for (let i = 0; i < n; i += 100) {
        const subArray = songUris.slice(i, i + 100);
        await addMutltipleSongsToPlaylist(token, subArray, playlistId);
        let loadingPercent = (x / numOfIterations) * 100;
        updateLoading(loadingPercent);
      }

      const playlistData = await fetchPlaylist(token, playlistId);
      if (playlistData && songNameToFileNameMapping) {
        let prevPlaylists = JSON.parse(localStorage.getItem("prevPlaylists"));
        if (!prevPlaylists) prevPlaylists = [];
        prevPlaylists.push({
          playlistData,
          songNameToFileNameMapping,
        });
        localStorage.setItem("prevPlaylists", JSON.stringify(prevPlaylists));
      }
      setPlaylist(playlistData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("handleAddSongs error:", error);
    }
  }

  return (
    <>
      {!playlist ? (
        <>
          <Form className="d-flex flex-column align-items-center">
            <Container>
              <Form.Group className="mb-3">
                <Form.Label>Playlist Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
              </Form.Group>
              <Form.Check
                type="checkbox"
                label="Public Playlist"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
            </Container>
            <Button
              className="col-12"
              variant="primary"
              onClick={handleAddSongs}
              disabled={!newPlaylistName.trim()}
            >
              {loading ? (
                <ProgressBar now={loading} label={`${loading}%`} />
              ) : (
                <>Add all device songs to a new spotify playlist</>
              )}
            </Button>
          </Form>
        </>
      ) : (
        <>
          <Alert variant="success">😊 Songs Added to Playlist! </Alert>
          <PlaylistCard playlist={playlist} />
          <Accordion defaultActiveKey="1" className="mt-3">
            {/* Songs Not found */}
            {songsNotFound.length > 0 && (
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  🥹 The songs below could not be found or added!
                </Accordion.Header>
                <Accordion.Body>
                  <ul>
                    {songsNotFound.map((song) => (
                      <li key={song}>{song}</li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            )}
            {/* name to song name mapping */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Spotify song name to song file name
              </Accordion.Header>
              <Accordion.Body>
                <SongTable
                  nameToFilenamesMapping={nameToFilenamesMapping}
                  keyVal={"new-playlist-table"}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </>
      )}
    </>
  );
}
