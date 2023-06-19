export async function fetchDataFromElectron(event, obj = {}) {
  try {
    const data = await window.electron.ipcRenderer.invoke(event, obj);
    return data;
  } catch (error) {
    console.log("ipcRenderer error:", error);
  }
}

export function buildSongNames(songsData) {
  let songNames = [];
  songsData.forEach((songData) => {
    let songName = "";
    if (!songData.title) {
      songName = songData.name.split("(")[0];
    } else {
      let { title, album, artist } = songData;
      if (title) {
        title = title.split("(")[0] + " ";
        songName += title;
      }
      if (album) {
        album = album.split("(")[0] + " ";
        if (album != title) songName += album;
      }
      if (artist) {
        artist = artist.split("(")[0] + " ";
        songName += artist;
      }
    }
    songNames.push(songName);
  });
  return songNames;
}
