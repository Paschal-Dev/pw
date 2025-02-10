import React from "react";
import ReactDOM from "react-dom/client";
import "typeface-inter";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "./assets/themes/theme.tsx";
import { Provider } from "react-redux";
import store from "./redux/store.tsx";

import "./i18n.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store} >
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
