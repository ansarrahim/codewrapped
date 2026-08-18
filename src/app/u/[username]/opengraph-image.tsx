import { ImageResponse } from "next/og";
import { getOrCreateWrap } from "@/lib/wrap-service";

export const alt = "CodeWrapped result card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const wrap = await getOrCreateWrap(username).catch(() => null);

  if (!wrap) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0d0221",
            fontSize: 40,
            color: "#f5f3ff",
          }}
        >
          CodeWrapped
        </div>
      ),
      { ...size }
    );
  }

  const topLang = wrap.topLanguages[0]?.name ?? "—";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0d0221",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(168,85,247,0.4), transparent 45%), radial-gradient(circle at 85% 80%, rgba(251,146,60,0.35), transparent 45%)",
          padding: "70px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 14,
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #fb923c 100%)",
              color: "#0d0221",
              fontSize: 24,
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            {"{}"}
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#f5f3ff" }}>
            CodeWrapped
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 50 }}>
          <div style={{ display: "flex", fontSize: 26, color: "#a89fc4" }}>@{wrap.login}&apos;s year in code</div>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              color: "#f5f3ff",
              marginTop: 10,
            }}
          >
            {wrap.personality.label}
          </div>
        </div>

        <div style={{ display: "flex", gap: 60, marginTop: 60 }}>
          <Stat value={String(wrap.totalContributions)} label="Contributions" />
          <Stat value={String(wrap.longestStreak)} label="Day streak" />
          <Stat value={topLang} label="Top language" />
        </div>
      </div>
    ),
    { ...size }
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#f5f3ff" }}>{value}</div>
      <div style={{ display: "flex", fontSize: 20, color: "#a89fc4", marginTop: 4 }}>{label}</div>
    </div>
  );
}
