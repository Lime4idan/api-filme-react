import styled, { keyframes } from "styled-components";

const shimmer = keyframes`from { background-position: 200% 0; } to { background-position: -200% 0; }`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 22px;
`;
const Card = styled.div`
  aspect-ratio: 2/3.42;
  border-radius: 18px;
  background: linear-gradient(100deg, #151a2a 20%, #232a40 38%, #151a2a 58%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.35s infinite linear;
`;

export default function LoadingSkeleton({ count = 10, label = "Carregando filmes" }) {
  return <Grid role="status" aria-label={label}>{Array.from({ length: count }, (_, index) => <Card key={index} />)}</Grid>;
}
