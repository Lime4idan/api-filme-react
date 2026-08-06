import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ToastProvider } from "./contexts/ToastContext";
import { theme } from "./styles/GlobalStyles";

export const renderApp = (ui, { route = "/" } = {}) => render(
  <MemoryRouter initialEntries={[route]}>
    <ThemeProvider theme={theme}>
      <ToastProvider><AuthProvider><FavoritesProvider>{ui}</FavoritesProvider></AuthProvider></ToastProvider>
    </ThemeProvider>
  </MemoryRouter>,
);
