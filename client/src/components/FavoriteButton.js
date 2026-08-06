import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import { useToast } from "../hooks/useToast";

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-width: ${({ $compact }) => $compact ? "42px" : "auto"};
  min-height: 42px;
  padding: ${({ $compact }) => $compact ? "0" : "0 16px"};
  border-radius: ${({ $compact }) => $compact ? "50%" : "12px"};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active }) => $active ? "rgba(255,77,103,.92)" : "rgba(10,12,20,.72)"};
  color: white;
  cursor: pointer;
  backdrop-filter: blur(14px);
  transition: transform .18s ease, background .18s ease;
  &:hover { transform: translateY(-2px); background: ${({ $active }) => $active ? "#ff3f5d" : "rgba(139,92,246,.5)"}; }
`;

export default function FavoriteButton({ movie, compact = false, className }) {
  const { user } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const toast = useToast();
  const navigate = useNavigate();
  const active = isFavorite(movie.id || movie.tmdbMovieId);
  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) { navigate("/login", { state: { from: window.location.pathname } }); return; }
    try { await toggle(movie); } catch (error) { toast.error(error.message); }
  };
  return (
    <Button className={className} onClick={handleClick} $active={active} $compact={compact} aria-label={active ? `Remover ${movie.title} dos favoritos` : `Adicionar ${movie.title} aos favoritos`} aria-pressed={active}>
      <Heart size={18} fill={active ? "currentColor" : "none"} />{!compact && (active ? "Salvo" : "Favoritar")}
    </Button>
  );
}
