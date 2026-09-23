import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../styles/GlobalStyles";
import AppErrorBoundary from "./AppErrorBoundary";

function BrokenView() {
  throw new Error("simulated failure");
}

test("replaces a rendering failure with a visible recovery screen", () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <AppErrorBoundary><BrokenView /></AppErrorBoundary>
      </ThemeProvider>
    </MemoryRouter>,
  );

  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "This session went off script." })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reload MovieHub" })).toBeInTheDocument();
  consoleError.mockRestore();
});
