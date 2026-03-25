import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// In dev mode, force the app to start at the home route.
// This avoids starting on a deep route (e.g. /admin) when the dev server opens.
if (import.meta.env.DEV && window.location.pathname !== "/") {
  window.location.replace("/");
}

createRoot(document.getElementById("root")!).render(<App />);
