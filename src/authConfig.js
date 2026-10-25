export const msalConfig = {
  auth: {
    clientId: "de747df2-4460-4e77-9a94-3e012089f8b9",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:5173",
  },
  cache: { cacheLocation: "localStorage" },
};

export const loginRequest = {
  scopes: ["User.Read", "Files.ReadWrite"],
  prompt: "select_account",
};

// Percorso del file su OneDrive, da adattare al tuo
export const FILE_PATH = "/Documenti/DB_Spese/DB_Spese.xlsx";