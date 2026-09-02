import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../styles/GlobalStyles";
import AppErrorBoundary from "./AppErrorBoundary";

function BrokenView() {
  throw new Error("falha simulada");
}

test("substitui uma falha de renderização por uma recuperação visível", () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <AppErrorBoundary><BrokenView /></AppErrorBoundary>
      </ThemeProvider>
    </MemoryRouter>,
  );

  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "A sessão saiu do roteiro." })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Recarregar MovieHub" })).toBeInTheDocument();
  consoleError.mockRestore();
});
