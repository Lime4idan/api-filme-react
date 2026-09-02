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
  display: grid; grid-template-columns: 320px minmax(0,1fr); gap: 26px;
  .identity { position: relative; overflow: hidden; padding-top: 85px; text-align: center; }
  .identity::before { content: ""; position: absolute; inset: 0 0 auto; height: 120px; background: radial-gradient(circle at 35% 20%,rgba(255,106,71,.48),transparent 40%),linear-gradient(120deg,rgba(255,54,94,.28),rgba(145,130,255,.16)); }
  .avatar { position: relative; width: 116px; height: 116px; display: grid; place-items: center; margin: 0 auto 17px; border: 5px solid #111319; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.coral}); box-shadow: 0 14px 36px rgba(0,0,0,.38); }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .email { color: ${({ theme }) => theme.colors.muted}; word-break: break-all; }
  .joined { display: flex; justify-content: center; gap: 7px; color: ${({ theme }) => theme.colors.muted}; font-size: .85rem; }
  .stats { display: grid; grid-template-columns: repeat(2,1fr); gap: 9px; margin-top: 24px; }
  .stat { padding: 14px; border: 1px solid rgba(255,255,255,.06); border-radius: 14px; background: rgba(255,255,255,.035); }
  .stat svg { color: ${({ theme }) => theme.colors.primary}; }
  .stat strong { display: block; font-size: 1.35rem; }
  .stat span { color: ${({ theme }) => theme.colors.muted}; font-size: .76rem; }
  .forms { display: grid; gap: 24px; }
  .forms > section { position: relative; overflow: hidden; }
  .forms > section::after { content: ""; position: absolute; width: 180px; height: 180px; right: -100px; top: -110px; border-radius: 50%; background: rgba(255,54,94,.055); }
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
