"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { isProduct, isRecord } from "@/api/response";
import type { Product } from "@/types/product";

export interface CartLine {
  readonly product: Product;
  readonly quantity: number;
}

interface CartState {
  readonly lines: CartLine[];
  readonly hydrated: boolean;
  readonly add: (product: Product) => void;
  readonly increase: (id: number) => void;
  readonly decrease: (id: number) => void;
  readonly remove: (id: number) => void;
  readonly clear: () => void;
}

const browserStorage: StateStorage = {
  getItem(name) {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    try {
      localStorage.setItem(name, value);
    } catch {
      /* Cart stays usable in memory. */
    }
  },
  removeItem(name) {
    try {
      localStorage.removeItem(name);
    } catch {
      /* No browser storage to clear. */
    }
  },
};

function isCartLine(line: unknown): line is CartLine {
  return (
    isRecord(line) &&
    isProduct(line.product) &&
    typeof line.quantity === "number" &&
    Number.isSafeInteger(line.quantity) &&
    line.quantity >= 1
  );
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      hydrated: false,
      add: (product) =>
        set(({ lines }) => ({
          lines: lines.some((line) => line.product.id === product.id)
            ? lines.map((line) =>
                line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line
              )
            : [...lines, { product, quantity: 1 }],
        })),
      increase: (id) =>
        set(({ lines }) => ({
          lines: lines.map((line) =>
            line.product.id === id ? { ...line, quantity: line.quantity + 1 } : line
          ),
        })),
      decrease: (id) =>
        set(({ lines }) => ({
          lines: lines.map((line) =>
            line.product.id === id && line.quantity > 1
              ? { ...line, quantity: line.quantity - 1 }
              : line
          ),
        })),
      remove: (id) =>
        set(({ lines }) => ({ lines: lines.filter((line) => line.product.id !== id) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "nova-store:cart",
      version: 1,
      storage: createJSONStorage(() => browserStorage),
      skipHydration: true,
      partialize: ({ lines }) => ({ lines }),
      merge: (persisted, current) => {
        const lines =
          isRecord(persisted) && Array.isArray(persisted.lines)
            ? persisted.lines.filter(isCartLine)
            : [];
        return {
          ...current,
          lines: Array.from(new Map(lines.map((line) => [line.product.id, line])).values()),
        };
      },
    }
  )
);

export function countUnits(lines: readonly CartLine[]) {
  return lines.reduce((count, line) => count + line.quantity, 0);
}

export function lineMinorTotal(line: CartLine) {
  return Math.round(line.product.price * 100) * line.quantity;
}

export function cartTotal(lines: readonly CartLine[]) {
  return lines.reduce((total, line) => total + lineMinorTotal(line), 0) / 100;
}
