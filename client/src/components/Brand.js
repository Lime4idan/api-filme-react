import { Clapperboard } from "lucide-react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wordmark = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 11px;
  font: 800 1.25rem "Manrope", sans-serif;
  letter-spacing: -.045em;

  .mark {
    position: relative;
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border-radius: 12px;
    background: linear-gradient(135deg, #ff6a47, #ff365e 55%, #9b75ff);
    box-shadow: 0 12px 30px rgba(255,54,94,.28);
  }

  .mark::after {
    content: "";
    position: absolute;
    inset: -60% -20%;
    transform: rotate(28deg);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
  }

  .hub { color: ${({ theme }) => theme.colors.primary}; }
`;

export default function Brand({ className, compact = false, onClick }) {
  return <Wordmark className={className} to="/" onClick={onClick} aria-label="MovieHub — início">
    <span className="mark"><Clapperboard size={20} /></span>
    {!compact && <span>Movie<span className="hub">Hub</span></span>}
  </Wordmark>;
}
