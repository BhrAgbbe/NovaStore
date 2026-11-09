"use client";

import { useState, type ReactNode } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledRegistry({ children }: { readonly children: ReactNode }) {
  const [sheet] = useState(() => new ServerStyleSheet());
  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });
  return typeof window === "undefined" ? (
    <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>
  ) : (
    children
  );
}
