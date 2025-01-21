import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import configureStore from "./store/store.js";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import * as sessionActions from "./store/session";
import { Modal, ModalProvider } from "./context/Modal";
import "./index.css";

const store = configureStore();

// Fetch CSRF token on app initialization
restoreCSRF(); // Always restore CSRF, even in production

// Expose store and session actions in non-production environments for debugging
if (import.meta.env.MODE !== "production") {
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
