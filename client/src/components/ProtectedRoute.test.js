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
  renderApp(<Routes><Route path="/private" element={<ProtectedRoute><div>Private content</div></ProtectedRoute>} /><Route path="/login" element={<div>Login screen</div>} /></Routes>, { route: "/private" });
  expect(await screen.findByText("Login screen")).toBeInTheDocument();
  expect(screen.queryByText("Private content")).not.toBeInTheDocument();
});
