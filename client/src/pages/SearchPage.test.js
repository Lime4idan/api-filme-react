import { screen } from "@testing-library/react";
import SearchPage from "./SearchPage";
import api from "../services/api";
import { movieService } from "../services/movieService";
import { renderApp } from "../testUtils";

jest.mock("../services/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn(), put: jest.fn() },
}));
jest.mock("../services/movieService", () => ({
  movieService: { genres: jest.fn(), search: jest.fn() },
}));

test("consulta a pesquisa a partir da query da URL", async () => {
  api.get.mockRejectedValue({ status: 401 });
  movieService.genres.mockResolvedValue({ genres: [] });
  movieService.search.mockResolvedValue({ page: 1, totalPages: 1, results: [{ id: 550, title: "Clube da Luta", release_date: "1999-10-15", vote_average: 8.4 }] });
  renderApp(<SearchPage />, { route: "/pesquisa?query=clube&page=1" });
  expect(await screen.findByText("Clube da Luta")).toBeInTheDocument();
  expect(movieService.search).toHaveBeenCalledWith(expect.objectContaining({ query: "clube", page: 1 }));
});
