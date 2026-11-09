import { apiInstance } from "@/api/client";
import { isCategory, isProduct, parseList } from "@/api/response";

export async function getProducts() {
  const { data } = await apiInstance.get<unknown>("/products");
  return parseList(data, isProduct);
}

export async function getCategories() {
  const { data } = await apiInstance.get<unknown>("/products/categories");
  return parseList(data, isCategory);
}
