import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthPage from "./AuthPage";
import api from "../services/api";
import { renderApp } from "../testUtils";

jest.mock("../services/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn(), put: jest.fn() },
}));

beforeEach(() => {
  jest.clearAllMocks();
  api.get.mockRejectedValue({ status: 401 });
});

test("envia o formulário de login e autentica", async () => {
  api.post.mockResolvedValue({ data: { user: { id: 1, name: "Ana", email: "ana@example.com", role: "USER" } } });
  renderApp(<AuthPage mode="login" />, { route: "/login" });
  await userEvent.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await userEvent.type(screen.getByLabelText("Senha"), "SenhaSegura123!");
  await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
  await waitFor(() => expect(api.post).toHaveBeenCalledWith("/auth/login", { email: "ana@example.com", password: "SenhaSegura123!" }));
});
