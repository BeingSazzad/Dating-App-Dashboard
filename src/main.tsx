import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store";
// Importing the services barrel ensures every injectEndpoints() call runs,
// registering all RTK Query hooks before the app renders.
import "@/services";
import App from "@/App";
import "@/styles/globals.css";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster closeButton position="top-right" />
    </Provider>
  </React.StrictMode>,
);
