import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import App from "./App/index";
import * as serviceWorker from "./serviceWorker";
import { initializeFirebase } from "./pushNotification";
import { persistor, store } from "./redux/store";
import "react-toastify/dist/ReactToastify.css";

// initializing firebase notification

if (window.safari) {
  console.log("safari browser detected");
} else {
  initializeFirebase();
}

const app = (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

serviceWorker.unregister();
