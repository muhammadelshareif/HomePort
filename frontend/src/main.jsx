import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import configureStore from "./store/store";
import { restoreCSRF, csrfFetch } from "./store/csrf";

const store = configureStore();

if (import.meta.env.MODE === "development") {
  // Changed this line to be explicit
  restoreCSRF();
  window.csrfFetch = csrfFetch;
  window.store = store;
  console.log("Store attached to window object"); // Add this debug line
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
