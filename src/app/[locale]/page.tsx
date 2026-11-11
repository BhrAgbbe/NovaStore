import { Suspense } from "react";
import CatalogContent from "@/components/catalog/CatalogContent";
import CatalogScreen from "@/components/catalog/CatalogScreen";

export default function HomePage({
  searchParams,
}: {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<CatalogScreen state={{ status: "loading" }} />}>
      <CatalogContent searchParams={searchParams} />
    </Suspense>
  );
}
