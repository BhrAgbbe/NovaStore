import { Suspense } from "react";
import CatalogContent from "@/components/catalog/CatalogContent";
import CatalogScreen from "@/components/catalog/CatalogScreen";

export default function HomePage() {
  return (
    <Suspense fallback={<CatalogScreen state={{ status: "loading" }} />}>
      <CatalogContent />
    </Suspense>
  );
}
