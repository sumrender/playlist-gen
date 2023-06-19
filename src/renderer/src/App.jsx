import Header from "./components/Header";
import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import Home from "./components/Home";

const clientId = "79266cecabf348d581917b70a6a28c12";
const redirectUri = "http://localhost:5173/callback";

export default function App() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    async function onInit() {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.hash.slice(1)); // Remove the leading '#'

      const token = params.get("access_token");

      if (token) {
        setAccessToken(token);
      }
    }
    onInit();
  }, []);

  const handleLogin = () => {
    const scopes = [
      "playlist-read-private",
      "playlist-modify-public",
      "playlist-modify-public",
    ];

    const scopeString = scopes.join(" ");

    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopeString)}&response_type=token`;
  };

  return (
    <>
      <Header />
      {accessToken ? (
        <Home token={accessToken} />
      ) : (
        <Auth handleLogin={handleLogin} />
      )}
    </>
  );
}
