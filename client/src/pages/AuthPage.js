import { Check, Eye, EyeOff, Film, LockKeyhole, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { Button, Field, FormGrid } from "../styles/ui";
import Brand from "../components/Brand";

const Screen = styled.main`
  min-height: 100vh; display: grid; grid-template-columns: minmax(0,1.12fr) minmax(430px,.88fr); background: #060709;
  .art { position: relative; min-height: 100vh; display: flex; align-items: flex-end; padding: clamp(42px,6vw,86px); overflow: hidden; background: radial-gradient(circle at 24% 17%,rgba(255,54,94,.28),transparent 25rem),radial-gradient(circle at 80% 80%,rgba(145,130,255,.14),transparent 28rem),#090a0e; }
  .art::before { content: ""; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px); background-size: 70px 70px; mask-image: linear-gradient(to bottom,black,transparent 82%); }
  .art-brand { position: absolute; z-index: 2; top: clamp(32px,5vw,64px); left: clamp(42px,6vw,86px); }
  .poster-stack { position: absolute; z-index: 1; top: 7%; right: 2%; width: min(43%,420px); height: 47%; }
  .poster { position: absolute; inset: 0; overflow: hidden; border: 1px solid rgba(255,255,255,.12); border-radius: 28px; background: linear-gradient(155deg,#2c1522,#12131a 62%); box-shadow: -30px 40px 100px rgba(0,0,0,.5); transform: rotate(7deg); }
  .poster::before { content: ""; position: absolute; width: 280px; height: 280px; top: 12%; right: -20%; border-radius: 50%; background: radial-gradient(circle,#ff6a47,rgba(255,54,94,.15) 45%,transparent 70%); filter: blur(5px); }
  .poster::after { content: "MH"; position: absolute; right: 8%; bottom: 2%; font: 800 clamp(6rem,12vw,11rem)/1 "Manrope"; letter-spacing: -.12em; color: rgba(255,255,255,.035); }
  .poster-card { position: absolute; z-index: 2; right: 48%; bottom: 5%; width: 68%; padding: 20px; border: 1px solid rgba(255,255,255,.13); border-radius: 20px; background: rgba(13,15,19,.78); backdrop-filter: blur(18px); box-shadow: 0 24px 70px rgba(0,0,0,.45); }
  .poster-card span { color: ${({ theme }) => theme.colors.accent}; font-size: .66rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
  .poster-card strong { display: block; margin-top: 7px; font: 700 1.08rem "Manrope"; }
  .poster-card small { display: block; margin-top: 6px; color: ${({ theme }) => theme.colors.muted}; line-height: 1.5; }
  .brand-copy { position: relative; z-index: 3; max-width: 610px; }
  .brand-copy h1 { font-size: clamp(3.2rem,5.8vw,6.2rem); line-height: .9; margin-bottom: 22px; text-wrap: balance; }
  .brand-copy h1 em { color: ${({ theme }) => theme.colors.coral}; font-style: normal; }
  .brand-copy > p { color: #aeb2bc; max-width: 510px; font-size: 1.05rem; line-height: 1.7; }
  .benefits { display: flex; flex-wrap: wrap; gap: 9px 17px; margin-top: 25px; color: #c7cad1; font-size: .8rem; }
  .benefits span { display: inline-flex; align-items: center; gap: 6px; }
  .benefits svg { color: ${({ theme }) => theme.colors.success}; }
  .form-side { position: relative; display: grid; place-items: center; padding: 42px; background: radial-gradient(circle at 100% 0,rgba(255,54,94,.07),transparent 25rem); }
  .form-card { width: min(440px,100%); animation: fadeUp .45s ease both; }
  .form-kicker { display: inline-flex; align-items: center; gap: 7px; margin-bottom: 17px; color: ${({ theme }) => theme.colors.accent}; font-size: .72rem; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
  .form-card h1 { font-size: clamp(2.2rem,4vw,3.3rem); line-height: 1; margin-bottom: 12px; }
  .form-card > p { color: ${({ theme }) => theme.colors.muted}; margin-bottom: 30px; line-height: 1.6; }
  .error { padding: 13px 14px; border: 1px solid rgba(255,86,112,.2); border-radius: 12px; background: rgba(255,86,112,.08); color: #ff9baa; }
  .password-field { position: relative; }
  .password-field input { padding-right: 48px; }
  .reveal { position: absolute; right: 7px; top: 7px; width: 38px; height: 38px; display: grid; place-items: center; border: 0; background: transparent; color: ${({ theme }) => theme.colors.muted}; cursor: pointer; }
  .submit { width: 100%; margin-top: 4px; }
  .secure { display: flex; justify-content: center; align-items: center; gap: 7px; margin-top: 18px; color: #6f7581; font-size: .72rem; }
  .switch { text-align: center; margin-top: 24px; color: ${({ theme }) => theme.colors.muted}; }
  .switch a { color: ${({ theme }) => theme.colors.coral}; font-weight: 700; }
  @media (max-width: 960px) { grid-template-columns: 1fr; .art { display: none; } .form-side { min-height: 100vh; padding: 28px 22px; } }
`;

export default function AuthPage({ mode }) {
  const registerMode = mode === "register";
  const { user, login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (registerMode && values.password !== values.confirmPassword) { setError("Passwords do not match"); return; }
    setBusy(true);
    try {
      if (registerMode) await register(values); else await login({ email: values.email, password: values.password });
      toast.success(registerMode ? "Account created. Welcome to MovieHub!" : "Welcome back!");
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <Screen><section className="art"><Brand className="art-brand" /><div className="poster-stack" aria-hidden="true"><div className="poster" /><div className="poster-card"><span>Personal curation</span><strong>Your cinema. Your rules.</strong><small>Lists, ratings, and discoveries in one place.</small></div></div><div className="brand-copy"><h1>Stories that stay <em>with you.</em></h1><p>Discover new worlds, build your curation, and turn every movie night into something worth sharing.</p><div className="benefits"><span><Check size={15} /> Unlimited lists</span><span><Check size={15} /> Personal recommendations</span><span><Check size={15} /> Movie-loving community</span></div></div></section><section className="form-side"><div className="form-card"><span className="form-kicker">{registerMode ? <Sparkles size={14} /> : <Film size={14} />} {registerMode ? "Join the club" : "Your session continues"}</span><h1>{registerMode ? "Create your space" : "Welcome back"}</h1><p>{registerMode ? "A movie curation as unique as your taste." : "Sign in to keep discovering great stories."}</p><FormGrid onSubmit={submit} noValidate>{error && <div className="error" id="form-error" role="alert">{error}</div>}{registerMode && <Field>Name<input name="name" value={values.name} onChange={change} minLength={2} maxLength={80} required autoComplete="name" aria-describedby={error ? "form-error" : undefined} placeholder="What should we call you?" /></Field>}<Field>Email<input name="email" type="email" value={values.email} onChange={change} required autoComplete="email" placeholder="you@example.com" /></Field><Field>Password<div className="password-field"><input name="password" type={showPassword ? "text" : "password"} value={values.password} onChange={change} minLength={registerMode ? 8 : 1} required autoComplete={registerMode ? "new-password" : "current-password"} placeholder="Your password" /><button className="reveal" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{registerMode && <span>Use at least 8 characters.</span>}</Field>{registerMode && <Field>Confirm password<input name="confirmPassword" type={showPassword ? "text" : "password"} value={values.confirmPassword} onChange={change} minLength={8} required autoComplete="new-password" placeholder="Repeat your password" /></Field>}<Button className="submit" disabled={busy}>{busy ? "Preparing your session..." : registerMode ? "Create my account" : "Sign in"}</Button></FormGrid><span className="secure"><LockKeyhole size={13} /> Your data is protected with encryption</span><p className="switch">{registerMode ? "Already have an account? " : "New to MovieHub? "}<Link to={registerMode ? "/login" : "/cadastro"}>{registerMode ? "Sign in" : "Create a free account"}</Link></p></div></section></Screen>;
}
