import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { LikesProvider } from "./context/LikesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/CPIT-405-Group_Project/">
      <AuthProvider>
        <LikesProvider>
          <App />
        </LikesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
