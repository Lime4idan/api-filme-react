import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import { renderApp } from "../testUtils";
import SearchBar from "./SearchBar";

jest.mock("../services/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn(), put: jest.fn() },
}));

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}{location.search}</span>;
}

test("searches on Enter and synchronizes the URL query", async () => {
  api.get.mockRejectedValue({ status: 401 });
  renderApp(<><SearchBar /><LocationProbe /></>);

  await userEvent.type(screen.getByLabelText("Search movies"), "Dune{enter}");

  await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/pesquisa?query=Dune&page=1"));
});
