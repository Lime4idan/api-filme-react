import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import CollectionPage from "./pages/CollectionPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/HomePage";
import ListDetailPage from "./pages/ListDetailPage";
import ListsPage from "./pages/ListsPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import PublicListPage from "./pages/PublicListPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import SearchPage from "./pages/SearchPage";

const Private = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

export default function App() {
  return <Routes>
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/cadastro" element={<AuthPage mode="register" />} />
    <Route element={<AppShell />}>
      <Route index element={<HomePage />} />
      <Route path="filme/:id" element={<MovieDetailsPage />} />
      <Route path="categoria/:genreId" element={<CollectionPage />} />
      <Route path="melhores-avaliados" element={<CollectionPage type="topRated" />} />
      <Route path="lancamentos" element={<CollectionPage type="upcoming" />} />
      <Route path="em-cartaz" element={<CollectionPage type="nowPlaying" />} />
      <Route path="pesquisa" element={<SearchPage />} />
      <Route path="perfil" element={<Private><ProfilePage /></Private>} />
      <Route path="minha-lista" element={<Private><FavoritesPage /></Private>} />
      <Route path="listas" element={<Private><ListsPage /></Private>} />
      <Route path="listas/:id" element={<Private><ListDetailPage /></Private>} />
      <Route path="lista/:shareCode" element={<PublicListPage />} />
      <Route path="usuario/:id" element={<PublicProfilePage />} />
      <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  </Routes>;
}
