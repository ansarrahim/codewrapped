import { ImageResponse } from "next/og";

export const alt = "CodeWrapped — your GitHub year, wrapped";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#0d0221",
          backgroundImage:
            "radial-gradient(circle at 10% 15%, rgba(168,85,247,0.35), transparent 45%), radial-gradient(circle at 90% 20%, rgba(236,72,153,0.3), transparent 40%), radial-gradient(circle at 50% 90%, rgba(251,146,60,0.25), transparent 45%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 72,
              height: 72,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #fb923c 100%)",
              color: "#0d0221",
              fontSize: 30,
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            {"{}"}
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#f5f3ff" }}>
            CodeWrapped
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            color: "#f5f3ff",
            lineHeight: 1.2,
            maxWidth: 1000,
          }}
        >
          Your GitHub year,
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.2,
            maxWidth: 1000,
            backgroundImage: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #fb923c 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          wrapped up.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 26,
            color: "#a89fc4",
          }}
        >
          Enter any GitHub username · Real stats · Shareable card
        </div>
      </div>
    ),
    { ...size }
  );
}
