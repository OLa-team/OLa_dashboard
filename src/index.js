import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { AuthProvider } from "./context/AuthContext.js";
import { PageProvider } from "./context/PageContext.js";
import { PatientProvider } from "./context/PatientContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PatientProvider>
        <PageProvider>
          <App />
        </PageProvider>
      </PatientProvider>
    </AuthProvider>
  </React.StrictMode>
);
