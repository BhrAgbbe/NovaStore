import { Category, Sort } from "@/types/enums/catalog";
import { apiInstance } from "@/api/client";
import { isCategory, isProduct, parseList } from "@/api/response";

export async function getProduct(id: number) {
  const { data } = await apiInstance.get<unknown>("/products/" + id);
  if (!isProduct(data) || data.id !== id) return null;
  return data;
}

async function readProducts(path: string, sort: Sort = Sort.Featured) {
  const { data } = await apiInstance.get<unknown>(path, {
    params: { sort: sort === Sort.PriceDescending ? "desc" : "asc" },
  });
  return parseList(data, isProduct);
}

export async function getProducts(category = Category.All, sort: Sort = Sort.Featured) {
  if (category === Category.All) return readProducts("/products", sort);
  const names =
    category === Category.Apparel
      ? ["men's clothing", "women's clothing"]
      : [category === Category.Jewelry ? "jewelery" : category];
  const groups = await Promise.all(
    names.map((name) => readProducts("/products/category/" + encodeURIComponent(name), sort))
  );
  return groups.flat().sort((left, right) => left.id - right.id);
}

export async function getCategories() {
  const { data } = await apiInstance.get<unknown>("/products/categories");
  return parseList(data, isCategory);
}

export async function getCatalog(category = Category.All, sort: Sort = Sort.Featured) {
  const [products, categories] = await Promise.all([getProducts(category, sort), getCategories()]);
  return { products, categories };
}
