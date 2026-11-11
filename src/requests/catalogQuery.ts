import type { Category, Sort } from "@/types/enums/catalog";
import { useQuery } from "@tanstack/react-query";
import { browserApiInstance } from "@/api/browserClient";
import type { CatalogData } from "@/types/product";

const catalogKey = ["store", "catalog"] as const;

async function retryCatalog(category: Category, sort: Sort, signal: AbortSignal) {
  const { data } = await browserApiInstance.get<CatalogData>("/catalog", {
    signal,
    params: { category, sort },
  });
  return data;
}

export function useCatalogQuery(category: Category, sort: Sort, enabled: boolean, initialData?: CatalogData) {
  return useQuery({
    queryKey: [...catalogKey, category, sort],
    queryFn: ({ signal }) => retryCatalog(category, sort, signal),
    initialData,
    enabled,
  });
}
