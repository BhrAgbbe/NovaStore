"use client";

import { useEffect, type ReactNode } from "react";
import { useCart } from "@/storage/cart";

export default function CartHydration({ children }: { readonly children: ReactNode }) {
  useEffect(() => {
    if (!useCart.getState().hydrated) {
      void Promise.resolve(useCart.persist.rehydrate()).finally(() =>
        useCart.setState({ hydrated: true })
      );
    }
  }, []);
  return children;
}
