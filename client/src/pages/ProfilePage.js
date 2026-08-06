import { CalendarDays, Heart, ListVideo, LogOut, MessageSquareText, Save, Star, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import api from "../services/api";
import { Button, Eyebrow, Field, FormGrid, Page, PageHeader, Panel } from "../styles/ui";
import { formatDate } from "../utils/movie";

const Layout = styled.div`
  display: grid; grid-template-columns: 300px minmax(0,1fr); gap: 24px;
  .identity { text-align: center; }
  .avatar { width: 110px; height: 110px; display: grid; place-items: center; margin: 0 auto 16px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.coral}); }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .email { color: ${({ theme }) => theme.colors.muted}; word-break: break-all; }
  .joined { display: flex; justify-content: center; gap: 7px; color: ${({ theme }) => theme.colors.muted}; font-size: .85rem; }
  .stats { display: grid; grid-template-columns: repeat(2,1fr); gap: 9px; margin-top: 22px; }
  .stat { padding: 12px; border-radius: 12px; background: rgba(255,255,255,.04); }
  .stat strong { display: block; font-size: 1.35rem; }
  .stat span { color: ${({ theme }) => theme.colors.muted}; font-size: .76rem; }
  .forms { display: grid; gap: 24px; }
  .form-actions { display: flex; justify-content: flex-end; }
  @media (max-width: 800px) { grid-template-columns: 1fr; }
`;

export default function ProfilePage() {
  const { setUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  useEffect(() => { api.get("/profile").then(({ data }) => setProfile(data.user)).catch((error) => toast.error(error.message)); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!profile) return <Page><p>Carregando perfil...</p></Page>;
  const save = async (event) => {
    event.preventDefault();
    try { const { data } = await api.put("/profile", { name: profile.name, avatarUrl: profile.avatarUrl || null, bio: profile.bio || null }); setProfile((current) => ({ ...current, ...data.user })); setUser(data.user); toast.success("Perfil atualizado"); } catch (error) { toast.error(error.message); }
  };
  const changePassword = async (event) => {
    event.preventDefault();
    try { await api.put("/profile/password", passwords); setPasswords({ currentPassword: "", newPassword: "" }); toast.success("Senha alterada com segurança"); } catch (error) { toast.error(error.message); }
  };
  const stats = [{ key: "favorites", label: "Favoritos", Icon: Heart }, { key: "lists", label: "Listas", Icon: ListVideo }, { key: "comments", label: "Comentários", Icon: MessageSquareText }, { key: "ratings", label: "Avaliações", Icon: Star }];
  return <Page><PageHeader><div><Eyebrow>Seu espaço</Eyebrow><h1>Perfil</h1><p>Mantenha sua identidade e sua conta sempre atualizadas.</p></div><Button $variant="ghost" onClick={async () => { await logout(); navigate("/"); }}><LogOut size={17} /> Sair</Button></PageHeader><Layout><Panel className="identity"><div className="avatar">{profile.avatarUrl ? <img src={profile.avatarUrl} alt={`Avatar de ${profile.name}`} /> : <UserRound size={42} />}</div><h2>{profile.name}</h2><p className="email">{profile.email}</p><p className="joined"><CalendarDays size={15} /> Desde {formatDate(profile.createdAt)}</p><div className="stats">{stats.map(({ key, label, Icon }) => <div className="stat" key={key}><Icon size={17} /><strong>{profile.stats?.[key] || 0}</strong><span>{label}</span></div>)}</div></Panel><div className="forms"><Panel><h2>Informações públicas</h2><FormGrid onSubmit={save}><Field>Nome<input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} minLength={2} maxLength={80} required /></Field><Field>URL do avatar<input type="url" value={profile.avatarUrl || ""} onChange={(event) => setProfile({ ...profile, avatarUrl: event.target.value })} placeholder="https://..." /></Field><Field>Biografia<textarea value={profile.bio || ""} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} maxLength={500} placeholder="Conte um pouco sobre o seu gosto por cinema." /></Field><div className="form-actions"><Button><Save size={17} /> Salvar perfil</Button></div></FormGrid></Panel><Panel><h2>Alterar senha</h2><FormGrid onSubmit={changePassword}><Field>Senha atual<input type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} autoComplete="current-password" required /></Field><Field>Nova senha<input type="password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} minLength={8} autoComplete="new-password" required /></Field><div className="form-actions"><Button $variant="ghost">Atualizar senha</Button></div></FormGrid></Panel></div></Layout></Page>;
}
