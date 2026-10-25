import { useEffect, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest, FILE_PATH } from "./authConfig";
import GraficoMensile from "./GraficoMensile";

const msal = new PublicClientApplication(msalConfig);

export default function App() {
  const [ready, setReady] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    msal
      .initialize()
      .then(() => msal.handleRedirectPromise())
      .then(() => setReady(true))
      .catch((e) => setError(e.message));
  }, []);

  async function getToken() {
    const account = msal.getAllAccounts()[0];
    if (!account) {
      await msal.loginRedirect(loginRequest);
      return null;
    }
    try {
      const { accessToken } = await msal.acquireTokenSilent({
        ...loginRequest,
        account,
      });
      return accessToken;
    } catch {
      await msal.acquireTokenRedirect(loginRequest);
      return null;
    }
  }

  async function caricaTransazioni() {
    try {
      setError("");
      const token = await getToken();
      if (!token) return;

      const url =
        `https://graph.microsoft.com/v1.0/me/drive/root:${FILE_PATH}:` +
        `/workbook/tables/Transazione/rows`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);

      const data = await res.json();
      setRows(data.value.map((r) => r.values[0]));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h1>Finanze</h1>
      <button onClick={caricaTransazioni} disabled={!ready}>
        Carica transazioni
      </button>
      {error && <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</pre>}
      <p>Movimenti letti: {rows.length}</p>
      {rows.length > 0 && <GraficoMensile rows={rows} />}
      <ul>
        {rows.slice(0, 20).map((r, i) => (
          <li key={i}>
            {String(r[1]).slice(0, 10)} | {r[2]} | {r[3]} € | {r[4]}
          </li>
        ))}
      </ul>
    </div>
  );
}