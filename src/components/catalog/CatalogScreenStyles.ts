import styled from "styled-components";

export const Content = styled.main`
  max-width: 1440px;
  margin-inline: auto;
  width: 100%;
  padding: 16px var(--gutter);
  display: grid;
  gap: 20px;
  @media (min-width: 768px) {
    padding-block: 28px;
    gap: 26px;
  }
`;
export const Filters = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: min(100%, 360px);
  justify-self: center;
  gap: 8px;
  button {
    display: flex;
    gap: 6px;
    align-items: center;
    min-height: 44px;
    justify-content: center;
    padding: 0 10px;
    border: 1px solid var(--line);
    border-radius: 22px;
    color: var(--muted);
    background: var(--surface);
    font-size: 13px;
  }
  button[aria-pressed="true"] {
    color: var(--brand-ink);
    background: var(--tint);
    border-color: var(--brand);
    font-weight: 700;
  }
  @media (min-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: auto;
    gap: 9px;
    button {
      min-height: 40px;
    }
  }
`;
export const Results = styled.section`
  display: grid;
  gap: 20px;
  .heading {
    display: grid;
    gap: 20px;
    justify-items: start;
  }
  .heading small {
    color: var(--brand-ink);
    font:
      700 12px Inter,
      sans-serif;
  }
  .heading h1,
  .heading h2 {
    font-size: 26px;
    margin-block: 4px;
  }
  .heading p {
    color: var(--muted);
    font-size: 13px;
  }
  @media (min-width: 768px) {
    gap: 26px;
    .heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .heading h1,
    .heading h2 {
      font-size: 32px;
    }
  }
`;
export const Grid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (min-width: 768px) {
    gap: 16px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;
export const CardSkeleton = styled.div`
  min-width: 0;
  padding: 12px;
  display: grid;
  gap: 12px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  span:first-child {
    aspect-ratio: 4/3;
  }
  span:last-child {
    height: 44px;
  }
`;
