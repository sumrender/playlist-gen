import Header from "./components/Header";
import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import Home from "./components/Home";

export default function App() {
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);

  console.log(location.href);

  useEffect(() => {
    window.electron.ipcRenderer.on("send-access-token", (_, args) => {
      if (args.access_token) setAccessToken(args.access_token);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Header />
      {accessToken ? (
        <Home token={accessToken} />
      ) : (
        <Auth loading={loading} setLoading={setLoading} />
      )}
    </>
  );
}
