import { Accordion, Alert } from "react-bootstrap";
import SongTable from "./SongTable";

export default function ShowPrevPlaylists() {
  const prevPlaylists = JSON.parse(localStorage.getItem("prevPlaylists")) || [];
  return (
    <>
      {prevPlaylists.length > 0 ? (
        <Accordion>
          {prevPlaylists.map((playlist, i) => {
            const { playlistData, songNameToFileNameMapping } = playlist;
            return (
              <Accordion.Item eventKey={i} key={playlistData.name + i}>
                <Accordion.Header>
                  {playlistData.name} ({songNameToFileNameMapping.length})
                </Accordion.Header>
                <Accordion.Body>
                  <SongTable
                    nameToFilenamesMapping={songNameToFileNameMapping}
                    keyVal={playlistData.uri}
                  />
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      ) : (
        <Alert variant="info">No previous playlist found!</Alert>
      )}
    </>
  );
}
