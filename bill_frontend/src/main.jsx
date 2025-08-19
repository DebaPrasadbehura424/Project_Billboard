import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./middleware/AuthController.jsx";
import { RollbasedProvider } from "./middleware/RollBasedAccessController.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RollbasedProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RollbasedProvider>
  </StrictMode>
);
