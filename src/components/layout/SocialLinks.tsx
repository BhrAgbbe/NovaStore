import styled from "styled-components";

const Items = styled.div`
  display: flex;
  direction: ltr;
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
  {
    label: "Twitter",
    url: process.env.NEXT_PUBLIC_NOVA_TWITTER_URL,
    path: "M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.6A11.4 11.4 0 0 1 3 4.7a4 4 0 0 0 1.2 5.4c-.6 0-1.2-.2-1.7-.5a4 4 0 0 0 3.2 4c-.5.1-1 .2-1.6.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.6a11.3 11.3 0 0 0 6.2 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2.1-2.2Z",
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
