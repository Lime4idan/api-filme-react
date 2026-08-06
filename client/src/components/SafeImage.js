import { Film } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Missing = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 25%, rgba(139,92,246,.24), transparent 50%), #151a29;
  color: #657087;
`;

export default function SafeImage({ src, alt, className, fallback, ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) return <Missing className={className} role="img" aria-label={alt || "Imagem indisponível"}>{fallback || <Film size={30} />}</Missing>;
  return <img className={className} src={src} alt={alt} onError={() => setFailed(true)} {...props} />;
}
