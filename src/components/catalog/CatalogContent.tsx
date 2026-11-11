import { readCatalogQuery } from "@/utils/catalog";
import { getCatalog } from "@/requests/catalogApi";
import CatalogScreen, { type CatalogState } from "./CatalogScreen";

export default async function CatalogContent({
  searchParams,
}: {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { category, sort } = readCatalogQuery({
    get: (key) => {
      const value = params[key];
      return typeof value === "string" ? value : null;
    },
  });
  let state: CatalogState;
  try {
    state = { status: "success", category, sort, data: await getCatalog(category, sort) };
  } catch {
    state = { status: "error" };
  }
  return <CatalogScreen state={state} />;
}
