import axios from "axios";

export async function fetchUser(token) {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (
      error.name === "AxiosError" &&
      error?.response.data.error.message === "The access token expired"
    ) {
      window.location.href = "http://localhost:5173";
      return;
    }

    console.log("Error fetching playlists:", error);
  }
}

export async function fetchPlaylist(token, playlistId) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching playlist:", error);
  }
}

export async function fetchPlaylists(token) {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.items;
  } catch (error) {
    console.log("Error fetching playlists:", error);
  }
}

export async function addSongToPlaylist(token, trackId, playlistId) {
  try {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: [trackId],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("Error adding to playlist:", error);
  }
}

export async function handleSearch(token, q) {
  if (!q) return;
  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      params: {
        q,
        type: "track",
        limit: 10,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.tracks.items;
  } catch (error) {
    console.log("Error searching:", error);
  }
}

export async function getTrackDetails(token, songName) {
  try {
    if (!songName) {
      return null;
    }

    const response = await axios.get("https://api.spotify.com/v1/search", {
      params: {
        q: songName,
        type: "track",
        limit: 1,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.tracks.items.length == 0) {
      return null;
    }
    return response.data.tracks.items[0];
  } catch (error) {
    console.log("Error finding songUri:", error);
    return null;
  }
}

export async function getSongsData(token, songNames) {
  try {
    let songNameToFileNameMapping = [];
    let songUris = [];
    let songsNotFoundOnSpotify = [];
    songNames.forEach(async (songName) => {
      const trackDetails = await getTrackDetails(token, songName);
      if (trackDetails) {
        songNameToFileNameMapping.push([trackDetails.name, songName]);
        songUris.push(trackDetails.uri);
      } else {
        console.log(`${songName} not found`);
        songsNotFoundOnSpotify.push(songName);
      }
    });
    songNameToFileNameMapping.sort((a, b) => a[0].localeCompare(b[0]));
    return { songUris, songsNotFoundOnSpotify, songNameToFileNameMapping };
  } catch (error) {
    console.log("getSongsData err:", error);
  }
}

export async function createPlaylist(token, playlistName, isPublic) {
  try {
    const user = await fetchUser(token);
    const response = await axios.post(
      `
      https://api.spotify.com/v1/users/${user.id}/playlists`,
      {
        name: playlistName,
        public: isPublic,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.id;
  } catch (error) {
    console.log("Error creating playlist:", error);
  }
}

export async function addMutltipleSongsToPlaylist(token, songUris, playlistId) {
  try {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: songUris,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("Error adding to playlist:", error);
  }
}
