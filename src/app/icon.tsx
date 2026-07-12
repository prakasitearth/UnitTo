import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a1628",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "7px",
          fontFamily: "Arial Black, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 900,
            color: "#0ea5e9",
            lineHeight: 1,
            letterSpacing: "-0.5px",
          }}
        >
          U
        </span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1,
            marginLeft: "1px",
          }}
        >
          →
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
