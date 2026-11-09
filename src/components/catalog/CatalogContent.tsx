import { getCategories, getProducts } from "@/requests/catalogApi";
import CatalogScreen, { type CatalogState } from "./CatalogScreen";

export default async function CatalogContent() {
  let state: CatalogState;
  try {
    const [products, categories] = await Promise.all([getProducts(), getCategories()]);
    state = { status: "success", products, categories };
  } catch {
    state = { status: "error" };
  }
  return <CatalogScreen state={state} />;
}
