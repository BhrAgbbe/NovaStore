import { readCatalogQuery } from "@/utils/catalog";
import { Category } from "@/types/enums/catalog";
import { getCatalog, getProducts } from "@/requests/catalogApi";

export async function GET(request: Request) {
  try {
    const { category, sort } = readCatalogQuery(new URL(request.url).searchParams);
    const data =
      category === Category.All
        ? await getCatalog(category, sort)
        : { products: await getProducts(category, sort), categories: [] };
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { error: "Catalog unavailable" },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
