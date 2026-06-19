import styled from "styled-components";

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0f172a;
`;

export const Sidebar = styled.aside`
  width: 260px;
  background: #111827;
  border-right: 1px solid rgba(255,255,255,0.05);

  padding: 40px 25px;

  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const Logo = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 60px;

  span {
    color: #8b5cf6;
  }
`;

export const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 15px;

  a {
    color: #94a3b8;
    text-decoration: none;

    padding: 14px 18px;
    border-radius: 12px;

    transition: 0.3s;

    font-weight: 600;
  }

  a:hover {
    background: rgba(139,92,246,0.15);
    color: white;
  }

  .active {
    background: #8b5cf6;
    color: white;
  }
`;

export const MainContent = styled.div`
  flex: 1;

  margin-left: 260px;

  @media (max-width: 900px) {
    margin-left: 0;
  }
`;

export const SearchBar = styled.div`
  padding: 30px;

  input {
    width: 100%;
    height: 60px;

    background: #1e293b;

    border: 1px solid rgba(255,255,255,0.05);

    border-radius: 16px;

    color: white;

    padding: 0 25px;

    font-size: 1rem;

    outline: none;
  }

  input:focus {
    border-color: #8b5cf6;
  }
`;

export const Hero = styled.section`
  height: 420px;

  margin: 0 30px;

  border-radius: 24px;

  overflow: hidden;

  position: relative;

  background-size: cover;
  background-position: center;

  display: flex;
  align-items: flex-end;

  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
`;

export const HeroOverlay = styled.div`
  position: absolute;

  inset: 0;

  background: linear-gradient(
    to top,
    rgba(15,23,42,1),
    rgba(15,23,42,.4)
  );
`;

export const HeroContent = styled.div`
  position: relative;

  z-index: 2;

  padding: 40px;

  max-width: 700px;

  h1 {
    color: white;
    font-size: 4rem;
    margin-bottom: 10px;
  }

  .meta {
    display: flex;
    gap: 20px;
    color: #cbd5e1;
    margin-bottom: 20px;
  }

  p {
    color: #e2e8f0;
    line-height: 1.7;
  }
`;

export const HeroButtons = styled.div`
  margin-top: 25px;

  button {
    background: #8b5cf6;
    border: none;

    padding: 14px 30px;

    border-radius: 12px;

    color: white;

    font-weight: 700;

    cursor: pointer;

    transition: 0.3s;
  }

  button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(139,92,246,.5);
  }
`;

export const Container = styled.div`
  padding: 40px 30px;
`;

export const SectionTitle = styled.h2`
  color: white;

  margin-bottom: 25px;

  font-size: 2rem;

  font-weight: 700;
`;

export const MovieList = styled.ul`
  list-style: none;

  display: grid;

  grid-template-columns: repeat(auto-fill,minmax(220px,1fr));

  gap: 25px;
`;

export const Movie = styled.li`
  background: #1e293b;

  border-radius: 18px;

  overflow: hidden;

  transition: .3s;

  cursor: pointer;

  border: 1px solid rgba(255,255,255,0.05);

  &:hover {
    transform: translateY(-8px);

    box-shadow: 0 15px 35px rgba(139,92,246,.25);
  }

  img {
    width: 100%;
    height: 340px;

    object-fit: cover;

    display: block;
  }

  .info {
    padding: 16px;
  }

  h3 {
    color: white;
    margin-bottom: 10px;
    font-size: 1rem;
  }

  .meta {
    display: flex;
    justify-content: space-between;

    color: #94a3b8;

    font-size: .9rem;
  }
`;