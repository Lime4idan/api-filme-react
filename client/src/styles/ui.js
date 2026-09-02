import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  padding: 48px clamp(22px, 4vw, 68px) 96px;
  animation: fadeUp .45s ease both;
  @media (max-width: 920px) { padding-top: 108px; }
  @media (max-width: 520px) { padding-inline: 18px; padding-bottom: 112px; }
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 38px;
  h1 { margin: 0 0 10px; font-size: clamp(2.4rem, 5vw, 4.6rem); line-height: .98; max-width: 900px; text-wrap: balance; }
  p { color: ${({ theme }) => theme.colors.muted}; margin: 0; max-width: 680px; line-height: 1.65; font-size: 1rem; }
  @media (max-width: 650px) { align-items: stretch; flex-direction: column; }
`;

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 700;
  font-size: .72rem;
  letter-spacing: .19em;
  text-transform: uppercase;
  margin-bottom: 13px;
  &::before { content: ""; width: 24px; height: 1px; background: currentColor; }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 48px;
  padding: 0 21px;
  border: 1px solid ${({ $variant, theme }) => $variant === "ghost" ? theme.colors.border : "transparent"};
  border-radius: 999px;
  background: ${({ $variant, theme }) => $variant === "ghost" ? "rgba(255,255,255,.065)" : $variant === "danger" ? theme.colors.danger : `linear-gradient(125deg, ${theme.colors.primary}, ${theme.colors.primaryStrong})`};
  color: white;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${({ $variant }) => $variant ? "none" : "0 10px 28px rgba(217,24,73,.25)"};
  transition: transform .22s ease, border-color .22s ease, background .22s ease, box-shadow .22s ease;
  &:hover:not(:disabled) { transform: translateY(-2px); border-color: rgba(255,255,255,.24); box-shadow: ${({ $variant }) => $variant ? "0 10px 30px rgba(0,0,0,.24)" : "0 14px 34px rgba(217,24,73,.36)"}; }
  &:disabled { opacity: .52; cursor: not-allowed; }
`;

export const IconButton = styled.button`
  width: 44px;
  height: 44px;
  display: inline-grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(8,9,12,.74);
  color: white;
  cursor: pointer;
  backdrop-filter: blur(14px);
  transition: transform .18s ease, background .18s ease;
  &:hover { transform: scale(1.06); background: rgba(255,54,94,.28); }
`;

export const Panel = styled.section`
  background: linear-gradient(145deg, rgba(20,23,29,.94), rgba(11,13,17,.96));
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  padding: clamp(18px, 3vw, 30px);
  box-shadow: 0 22px 70px rgba(0,0,0,.24);
`;

export const Field = styled.label`
  display: grid;
  gap: 8px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;
  font-size: .9rem;
  input, textarea, select {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 14px;
    background: #090b0f;
    color: ${({ theme }) => theme.colors.text};
    padding: 13px 14px;
    transition: border-color .2s;
  }
  textarea { min-height: 110px; resize: vertical; }
  input:focus, textarea:focus, select:focus { border-color: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 0 3px rgba(255,54,94,.1); outline: none; }
  small { color: ${({ theme }) => theme.colors.danger}; }
`;

export const FormGrid = styled.form`
  display: grid;
  gap: 18px;
`;

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 11px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: rgba(255,255,255,.075);
  color: #d8d9de;
  font-size: .82rem;
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
