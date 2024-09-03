import "./_assets/js/init";
import "./lib/wsocket"

import React from "react";
import { GlobalProvider } from "./context/Global";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import { AuthProvider } from "./context/Auth";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <AuthProvider>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  // </AuthProvider>
);

reportWebVitals();
