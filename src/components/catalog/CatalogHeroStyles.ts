import styled from "styled-components";

export const Hero = styled.div`
  border-radius: 18px;
  overflow: hidden;
  background: #f4e8db;
  color: #122139;
  .slide {
    display: grid;
    touch-action: pan-y pinch-zoom;
    user-select: none;
    transition: transform 200ms ease;
  }
  .slide[data-dragging="true"] {
    transition: none;
    cursor: grabbing;
  }
  .copy,
  .photo {
    animation: slide-appear 200ms ease-out;
  }
  @keyframes slide-appear {
    from {
      opacity: 0.65;
    }
    to {
      opacity: 1;
    }
  }
  .copy {
    padding: 20px;
    display: grid;
    gap: 12px;
    justify-items: start;
    align-content: center;
  }
  .photo {
    position: relative;
    grid-row: 1;
    min-height: 176px;
  }
  img {
    object-fit: cover;
  }
  .product-photo img {
    object-fit: contain;
  }
  .photo-skeleton {
    height: 100%;
    min-height: 176px;
  }
  h1 {
    font-size: 32px;
    white-space: pre-line;
  }
  p {
    font-size: 14px;
    color: #4e5261;
  }
  .copy button {
    min-width: 156px;
  }
  [data-theme="dark"] & {
    background: #24374e;
    color: #f4f7fb;
  }
  [data-theme="dark"] & p {
    color: #b1c0d3;
  }
  @media (min-width: 768px) {
    .slide {
      min-height: 276px;
      grid-template-columns: 48% 52%;
    }
    .copy {
      padding: 24px 26px;
    }
    .photo {
      grid-row: auto;
    }
    h1 {
      font-size: 35px;
    }
    p {
      font-size: 16px;
    }
    .copy button {
      min-width: 178px;
    }
  }
  @media (min-width: 1024px) {
    .slide {
      min-height: 350px;
    }
    .copy {
      padding: 24px clamp(26px, 3.33vw, 48px);
    }
    h1 {
      font-size: 49px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .slide {
      transition: none;
    }
    .copy,
    .photo {
      animation: none;
    }
  }
`;
export const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-block-start: 6px;
  .dot {
    min-width: 32px;
    min-height: 40px;
    display: grid;
    place-items: center;
    border: 0;
    background: transparent;
  }
  .dot::before {
    content: "";
    height: 8px;
    width: 8px;
    border-radius: 6px;
    background: var(--muted);
  }
  .dot[aria-current="true"]::before {
    width: 22px;
    background: var(--brand);
  }
`;

