import { Clapperboard } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { Button, Field, FormGrid } from "../styles/ui";

const Screen = styled.main`
  min-height: 100vh; display: grid; grid-template-columns: minmax(0,1.15fr) minmax(420px,.85fr); background: #090b14;
  .art { position: relative; display: flex; align-items: flex-end; padding: clamp(40px,7vw,100px); overflow: hidden; background: radial-gradient(circle at 32% 28%,rgba(139,92,246,.46),transparent 24rem),linear-gradient(145deg,#171329,#080b13); }
  .art::before { content: ""; position: absolute; width: 420px; height: 570px; right: -90px; top: 9%; border-radius: 30px; transform: rotate(10deg); border: 1px solid rgba(255,255,255,.12); background: linear-gradient(160deg,rgba(255,77,103,.26),rgba(139,92,246,.06)); box-shadow: -40px 50px 100px rgba(0,0,0,.45); }
  .brand { position: relative; z-index: 1; max-width: 640px; }
  .logo { display: flex; gap: 10px; align-items: center; margin-bottom: 22px; font: 800 1.2rem "Manrope"; }
  .logo span { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 12px; background: linear-gradient(135deg,#ff4d67,#8b5cf6); }
  .brand h1 { font-size: clamp(2.8rem,5vw,5rem); line-height: 1; margin-bottom: 20px; }
  .brand p { color: #aeb5c5; font-size: 1.08rem; line-height: 1.7; }
  .form-side { display: grid; place-items: center; padding: 34px; }
  .form-card { width: min(440px,100%); }
  .form-card > p { color: ${({ theme }) => theme.colors.muted}; }
  .error { padding: 12px; border-radius: 10px; background: rgba(255,77,103,.1); color: #ff9aaa; }
  .switch { text-align: center; margin-top: 20px; color: ${({ theme }) => theme.colors.muted}; }
  .switch a { color: #b89cff; font-weight: 700; }
  @media (max-width: 900px) { grid-template-columns: 1fr; .art { display: none; } .form-side { min-height: 100vh; padding: 24px; } }
`;

export default function AuthPage({ mode }) {
  const registerMode = mode === "register";
  const { user, login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (registerMode && values.password !== values.confirmPassword) { setError("As senhas não coincidem"); return; }
    setBusy(true);
    try {
      if (registerMode) await register(values); else await login({ email: values.email, password: values.password });
      toast.success(registerMode ? "Conta criada. Bem-vindo ao MovieHub!" : "Bem-vindo de volta!");
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <Screen><section className="art"><div className="brand"><div className="logo"><span><Clapperboard /></span> MovieHub</div><h1>Sua história com o cinema começa aqui.</h1><p>Descubra novos mundos, organize suas listas e transforme cada filme em uma conversa.</p></div></section><section className="form-side"><div className="form-card"><h1>{registerMode ? "Crie sua conta" : "Que bom ter você de volta"}</h1><p>{registerMode ? "Uma curadoria de cinema feita por você." : "Continue de onde sua próxima sessão parou."}</p><FormGrid onSubmit={submit} noValidate>{error && <div className="error" role="alert">{error}</div>}{registerMode && <Field>Nome<input name="name" value={values.name} onChange={change} minLength={2} maxLength={80} required autoComplete="name" aria-describedby={error ? "form-error" : undefined} /></Field>}<Field>E-mail<input name="email" type="email" value={values.email} onChange={change} required autoComplete="email" /></Field><Field>Senha<input name="password" type="password" value={values.password} onChange={change} minLength={registerMode ? 8 : 1} required autoComplete={registerMode ? "new-password" : "current-password"} />{registerMode && <span>Use pelo menos 8 caracteres.</span>}</Field>{registerMode && <Field>Confirme a senha<input name="confirmPassword" type="password" value={values.confirmPassword} onChange={change} minLength={8} required autoComplete="new-password" /></Field>}<Button disabled={busy}>{busy ? "Aguarde..." : registerMode ? "Criar minha conta" : "Entrar"}</Button></FormGrid><p className="switch">{registerMode ? "Já tem uma conta? " : "Ainda não tem conta? "}<Link to={registerMode ? "/login" : "/cadastro"}>{registerMode ? "Entrar" : "Criar gratuitamente"}</Link></p></div></section></Screen>;
}
