import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { AuthProvider } from "./context/AuthContext.js";
import { PageProvider } from "./context/PageContext.js";
import { PatientProvider } from "./context/PatientContext.js";
import { UserProvider } from "./context/UserContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PageProvider>
      <AuthProvider>
        <UserProvider>
          <PatientProvider>
            <App />
          </PatientProvider>
        </UserProvider>
      </AuthProvider>
    </PageProvider>
  </React.StrictMode>
);
