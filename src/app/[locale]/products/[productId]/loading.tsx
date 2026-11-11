import { Skeleton } from "@/shared/Skeleton";

export default function ProductLoading() {
  return (
    <main style={{ width: "min(100%, 1240px)", margin: "auto", padding: "40px var(--gutter)", display: "grid", gap: 24 }} aria-busy="true">
      <Skeleton style={{ width: 160, height: 24 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 24 }}>
        <Skeleton style={{ minHeight: 320, aspectRatio: "4/3" }} />
        <div style={{ display: "grid", gap: 18, alignContent: "start" }}>
          <Skeleton style={{ height: 26, width: 100 }} />
          <Skeleton style={{ height: 54 }} />
          <Skeleton style={{ height: 34, width: 150 }} />
          <Skeleton style={{ height: 120 }} />
          <Skeleton style={{ height: 48, width: 180 }} />
        </div>
      </div>
    </main>
  );
}
