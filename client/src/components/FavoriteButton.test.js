import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FavoriteButton from "./FavoriteButton";
import api from "../services/api";
import { renderApp } from "../testUtils";

jest.mock("../services/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn(), put: jest.fn() },
}));

test("salva favorito no backend para usuário autenticado", async () => {
  api.get.mockImplementation((path) => {
    if (path === "/auth/me") return Promise.resolve({ data: { user: { id: 1, name: "Ana", role: "USER" } } });
    if (path === "/favorites") return Promise.resolve({ data: { items: [] } });
    return Promise.reject(new Error("rota inesperada"));
  });
  api.post.mockResolvedValue({ data: { favorite: { id: 1, tmdbMovieId: 550, title: "Clube da Luta" } } });
  renderApp(<FavoriteButton movie={{ id: 550, title: "Clube da Luta", vote_average: 8.4 }} />);
  await waitFor(() => expect(api.get).toHaveBeenCalledWith("/favorites", { params: { limit: 50 } }));
  const button = await screen.findByRole("button", { name: "Adicionar Clube da Luta aos favoritos" });
  await userEvent.click(button);
  await waitFor(() => expect(api.post).toHaveBeenCalledWith("/favorites", expect.objectContaining({ tmdbMovieId: 550, title: "Clube da Luta" })));
});
