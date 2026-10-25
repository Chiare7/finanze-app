export const msalConfig = {
  auth: {
    clientId: "de747df2-4460-4e77-9a94-3e012089f8b9",
    authority: "https://login.microsoftonline.com/common",
    redirectUri:
      window.location.hostname === "localhost"
        ? "http://localhost:5173"
        : "https://chiare7.github.io/finanze-app/",
  },
  cache: { cacheLocation: "localStorage" },
};

export const loginRequest = {
  scopes: ["User.Read", "Files.ReadWrite"],
  prompt: "select_account",
};

// Percorso del file su OneDrive
export const FILE_PATH = "/Finanze/DB_Spese__template_.xlsx";