import styled from "styled-components";

const Items = styled.div`
  display: flex;
  gap: 8px;
  a,
  span {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #273a54;
    color: #f8f9fc;
  }
  span {
    color: #b7c4d8;
  }
  a:hover {
    background: #384f70;
  }
`;

const socials = [
  {
    label: "Instagram",
    url: process.env.NEXT_PUBLIC_NOVA_INSTAGRAM_URL,
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6-1h.01",
  },
  {
    label: "Telegram",
    url: process.env.NEXT_PUBLIC_NOVA_TELEGRAM_URL,
    path: "M22 3 2 10l6 2.5L10.5 21l3.1-5.3L19 20l3-17ZM8 12.5 22 3m-11.5 18 1.1-6.8L22 3",
  },
  {
    label: "LinkedIn",
    url: process.env.NEXT_PUBLIC_NOVA_LINKEDIN_URL,
    path: "M3 8h4v13H3zm8 0h4v2c1-2.5 6-2.5 6 2v9h-4v-7c0-2-2-2-2 0v7h-4zM5 3h.01",
  },
];

function externalUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export default function SocialLinks() {
  return (
    <Items>
      {socials.map(({ label, url, path }) => {
        const href = externalUrl(url);
        const icon = (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={path} />
          </svg>
        );
        return href ? (
          <a key={label} href={href} aria-label={label}>
            {icon}
          </a>
        ) : (
          <span key={label} role="img" aria-label={label} title={label}>
            {icon}
          </span>
        );
      })}
    </Items>
  );
}
