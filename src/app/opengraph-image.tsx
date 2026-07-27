import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public/images/kalm-touch-logo.png"),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "linear-gradient(115deg, #06303a 0%, #0a4a5c 48%, #0c5c7a 100%)",
          color: "#ffffff",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img
            src={logoSrc}
            width={112}
            height={110}
            alt=""
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 48,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {SITE.name}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: "rgba(255,255,255,0.78)",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                marginTop: 6,
              }}
            >
              {SITE.tagline}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 900,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 400,
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
            }}
          >
            Massage that restores what the day takes away.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "rgba(255,255,255,0.8)",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              lineHeight: 1.4,
              marginTop: 20,
            }}
          >
            {`On-site Swedish, deep tissue & prenatal · ${SITE.areaServed}`}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
