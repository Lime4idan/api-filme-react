import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import api from "../services/api";
import { renderApp } from "../testUtils";

jest.mock("../services/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn(), put: jest.fn() },
}));

test("redireciona visitante para o login", async () => {
  api.get.mockRejectedValue({ status: 401 });
  renderApp(<Routes><Route path="/privada" element={<ProtectedRoute><div>Conteúdo privado</div></ProtectedRoute>} /><Route path="/login" element={<div>Tela de login</div>} /></Routes>, { route: "/privada" });
  expect(await screen.findByText("Tela de login")).toBeInTheDocument();
  expect(screen.queryByText("Conteúdo privado")).not.toBeInTheDocument();
});
