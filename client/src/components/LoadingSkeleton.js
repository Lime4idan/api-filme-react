import styled, { keyframes } from "styled-components";

const shimmer = keyframes`from { background-position: 200% 0; } to { background-position: -200% 0; }`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 30px 22px;
`;
const Card = styled.div`
  aspect-ratio: 2/3.42;
  border: 1px solid rgba(255,255,255,.05);
  border-radius: 19px;
  background: linear-gradient(100deg, #111319 20%, #20232b 38%, #111319 58%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.35s infinite linear;
`;

export default function LoadingSkeleton({ count = 10, label = "Loading movies" }) {
  return <Grid role="status" aria-label={label}>{Array.from({ length: count }, (_, index) => <Card key={index} />)}</Grid>;
}
