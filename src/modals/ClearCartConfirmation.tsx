"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef } from "react";
import styled from "styled-components";
import { Button } from "@/shared/controls";

const Panel = styled.section`
  background: var(--error-bg);
  color: var(--error);
  padding: 22px;
  border: 1px solid var(--error);
  border-radius: 14px;
  display: grid;
  gap: 10px;
  h2 {
    font-size: 22px;
  }
  p {
    font-size: 14px;
  }
  .actions {
    display: flex;
    gap: 8px;
  }
`;

export default function ClearCartConfirmation({
  onCancel,
  onConfirm,
}: {
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}) {
  const t = useTranslations("Store");
  const heading = useId();
  const details = useId();
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    panel.current?.querySelector("button")?.focus();
  }, []);

  return (
    <Panel
      ref={panel}
      aria-labelledby={heading}
      aria-describedby={details}
      onKeyDown={(event) => {
        if (event.key === "Escape") onCancel();
      }}
    >
      <h2 id={heading}>{t("confirmClear")}</h2>
      <p id={details}>{t("confirmClearHelp")}</p>
      <div className="actions">
        <Button $kind="secondary" type="button" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button $kind="danger" type="button" onClick={onConfirm}>
          {t("clearCart")}
        </Button>
      </div>
    </Panel>
  );
}
