"use client";

import styled, { css } from "styled-components";
import { Link } from "@/dictionary/navigation";
import Icon, { type IconName } from "./Icon";

type Kind = "primary" | "secondary" | "quiet" | "danger";
interface ButtonStyle {
  readonly $kind?: Kind;
}
const buttonStyle = css<ButtonStyle>`
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid ${({ $kind }) => ($kind === "secondary" ? "var(--line)" : "transparent")};
  border-radius: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: ${({ $kind }) => ($kind === "danger" ? "var(--error)" : $kind === "secondary" || $kind === "quiet" ? "var(--ink)" : "var(--on-brand)")};
  background: ${({ $kind }) => ($kind === "danger" ? "var(--error-bg)" : $kind === "secondary" ? "var(--surface)" : $kind === "quiet" ? "var(--soft)" : "var(--brand)")};
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  &:hover:not(:disabled) {
    filter: brightness(0.96);
  }
  &:disabled {
    background: var(--soft);
    color: var(--muted);
  }
`;
export const Button = styled.button<ButtonStyle>`
  ${buttonStyle}
`;
export const ButtonLink = styled(Link)<ButtonStyle>`
  ${buttonStyle}
`;
export const Anchor = styled.a<ButtonStyle>`
  ${buttonStyle}
`;
export const IconButton = styled(Button).attrs({ $kind: "secondary" })`
  width: 44px;
  padding: 0;
`;

const Wordmark = styled.span<{ $inverse?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  direction: ltr;
  color: ${({ $inverse }) => ($inverse ? "white" : "var(--ink)")};
  font:
    700 27px/1.38 Inter,
    sans-serif;
  .nova-icon {
    color: ${({ $inverse }) => ($inverse ? "#FF8544" : "var(--brand-ink)")};
  }
`;
export function Brand({ inverse = false }: { readonly inverse?: boolean }) {
  return (
    <Wordmark $inverse={inverse}>
      <Icon name="bag" size={24} />
      NOVA
    </Wordmark>
  );
}

const State = styled.section`
  padding: 24px;
  display: grid;
  justify-items: center;
  gap: 10px;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  h2 {
    font-size: 22px;
  }
  p {
    font-size: 14px;
    color: var(--muted);
  }
  button,
  a {
    min-width: 180px;
  }
  .tile {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: 15px;
    color: var(--brand-ink);
    background: var(--tint);
  }
`;
interface StateProps {
  readonly icon: IconName;
  readonly title: string;
  readonly detail: string;
  readonly action: string;
  readonly onAction?: () => void;
  readonly href?: string;
}
export function EmptyState({ icon, title, detail, action, onAction, href }: StateProps) {
  return (
    <State>
      <span className="tile">
        <Icon name={icon} size={23} />
      </span>
      <h2>{title}</h2>
      <p>{detail}</p>
      {href ? (
        <ButtonLink $kind="secondary" href={href}>
          {action}
        </ButtonLink>
      ) : (
        <Button type="button" $kind="secondary" onClick={onAction}>
          {action}
        </Button>
      )}
    </State>
  );
}

const Feedback = styled.div<{ $variant: "success" | "error" }>`
  display: flex;
  gap: 10px;
  padding: 14px;
  border-radius: 10px;
  align-items: center;
  color: var(--${({ $variant }) => $variant});
  background: var(--${({ $variant }) => $variant}-bg);
  font-size: 14px;
  strong {
    display: block;
  }
  p {
    font-size: 12px;
    margin-top: 2px;
  }
`;
export function Banner({
  variant = "success",
  title,
  detail,
}: {
  readonly variant?: "success" | "error";
  readonly title: string;
  readonly detail?: string;
}) {
  return (
    <Feedback $variant={variant} role={variant === "error" ? "alert" : "status"}>
      <Icon name={variant === "error" ? "info" : "check"} />
      <div>
        <strong>{title}</strong>
        {detail && <p>{detail}</p>}
      </div>
    </Feedback>
  );
}
