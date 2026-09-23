import { screen } from "@testing-library/react";
import MovieCard from "./MovieCard";
import api from "../services/api";
import { renderApp } from "../testUtils";

jest.mock("../services/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn(), put: jest.fn() },
}));

test("shows title, rating, and details link", async () => {
  api.get.mockRejectedValue({ status: 401 });
  renderApp(<MovieCard movie={{ id: 550, title: "Fight Club", release_date: "1999-10-15", vote_average: 8.4, poster_path: null }} />);
  expect(screen.getByText("Fight Club")).toBeInTheDocument();
  expect(screen.getByText("8.4")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View details for Fight Club" })).toHaveAttribute("href", "/filme/550");
  expect(screen.getByLabelText("Image unavailable")).toBeInTheDocument();
});
