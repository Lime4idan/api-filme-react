import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ToastProvider } from "./contexts/ToastContext";
import GlobalStyles, { theme } from "./styles/GlobalStyles";
import AppErrorBoundary from "./components/AppErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AppErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              <FavoritesProvider>
                <App />
              </FavoritesProvider>
            </AuthProvider>
          </ToastProvider>
        </AppErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
