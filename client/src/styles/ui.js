import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  padding: 28px clamp(20px, 3.4vw, 56px) 72px;
  @media (max-width: 920px) { padding-top: 90px; }
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;
  h1 { margin: 0 0 8px; font-size: clamp(2rem, 4vw, 3.4rem); }
  p { color: ${({ theme }) => theme.colors.muted}; margin: 0; max-width: 650px; }
  @media (max-width: 650px) { align-items: stretch; flex-direction: column; }
`;

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.coral};
  font-weight: 700;
  font-size: .78rem;
  letter-spacing: .13em;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid ${({ $variant, theme }) => $variant === "ghost" ? theme.colors.border : "transparent"};
  border-radius: 12px;
  background: ${({ $variant, theme }) => $variant === "ghost" ? "rgba(255,255,255,.055)" : $variant === "danger" ? theme.colors.danger : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryStrong})`};
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: transform .18s ease, border-color .18s ease, background .18s ease;
  &:hover:not(:disabled) { transform: translateY(-2px); border-color: rgba(255,255,255,.22); }
  &:disabled { opacity: .52; cursor: not-allowed; }
`;

export const IconButton = styled.button`
  width: 42px;
  height: 42px;
  display: inline-grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(10,12,20,.7);
  color: white;
  cursor: pointer;
  backdrop-filter: blur(14px);
  transition: transform .18s ease, background .18s ease;
  &:hover { transform: scale(1.06); background: rgba(139,92,246,.32); }
`;

export const Panel = styled.section`
  background: linear-gradient(145deg, rgba(23,28,44,.94), rgba(14,17,29,.94));
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: clamp(18px, 3vw, 30px);
  box-shadow: 0 18px 50px rgba(0,0,0,.18);
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
    border-radius: 12px;
    background: #0d111d;
    color: ${({ theme }) => theme.colors.text};
    padding: 13px 14px;
    transition: border-color .2s;
  }
  textarea { min-height: 110px; resize: vertical; }
  input:focus, textarea:focus, select:focus { border-color: ${({ theme }) => theme.colors.primary}; outline: none; }
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
  background: rgba(255,255,255,.06);
  color: ${({ theme }) => theme.colors.muted};
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
