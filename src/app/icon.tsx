import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #fb923c 100%)",
          borderRadius: 7,
        }}
      >
        <span
          style={{
            display: "flex",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "monospace",
            color: "#0d0221",
          }}
        >
          {"{}"}
        </span>
      </div>
    ),
    { ...size }
  );
}
