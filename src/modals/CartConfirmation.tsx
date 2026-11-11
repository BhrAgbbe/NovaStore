"use client";

import { useTranslations } from "next-intl";
import Modal from "@/modals/Modal";
import { Button } from "@/shared/controls";

interface Props {
  readonly itemName?: string;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}

export default function CartConfirmation({ itemName, onCancel, onConfirm }: Props) {
  const t = useTranslations("Store");
  return (
    <Modal
      title={t(itemName ? "confirmRemove" : "confirmClear")}
      closeLabel={t("close")}
      onClose={onCancel}
    >
      <p dir={itemName ? "auto" : undefined}>{itemName ?? t("confirmClearHelp")}</p>
      <div className="dialog-actions">
        <Button $kind="secondary" type="button" onClick={onCancel} data-initial-focus>
          {t("cancel")}
        </Button>
        <Button $kind="danger" type="button" onClick={onConfirm}>
          {t(itemName ? "remove" : "clearCart")}
        </Button>
      </div>
    </Modal>
  );
}
