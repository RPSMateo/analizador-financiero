import { ImageResponse } from "next/og";

/**
 * Imagen Open Graph generada en build (estática). Es la previsualización que
 * aparece al compartir cualquier URL del sitio en WhatsApp, X, LinkedIn, etc.
 * Sigue el sistema visual minimal/premium: blanco amplio, tracking ajustado,
 * acento esmeralda único.
 */

export const alt = "RetiroLibre — Simulador de jubilación para freelancers argentinos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: marca + URL */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                background: "#10b981",
                marginRight: 16,
              }}
            />
            <div style={{ fontSize: 34, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.02em" }}>
              RetiroLibre
            </div>
          </div>
          <div style={{ fontSize: 24, color: "#9ca3af" }}>retirolibre.vercel.app</div>
        </div>

        {/* Middle: badge + título */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              border: "1px solid #e5e7eb",
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 24,
              color: "#4b5563",
              marginBottom: 36,
            }}
          >
            <div
              style={{ width: 10, height: 10, borderRadius: 999, background: "#10b981", marginRight: 12 }}
            />
            Para autónomos y freelancers argentinos
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontWeight: 700, letterSpacing: "-0.03em" }}>
            <div style={{ fontSize: 76, color: "#0a0a0a", lineHeight: 1.05 }}>
              Sabé cuánto necesitás
            </div>
            <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05 }}>
              <span style={{ color: "#0a0a0a" }}>ahorrar para&nbsp;</span>
              <span style={{ color: "#059669" }}>jubilarte</span>
            </div>
          </div>
        </div>

        {/* Bottom: subtítulo + CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #f3f4f6",
            paddingTop: 32,
          }}
        >
          <div style={{ fontSize: 26, color: "#6b7280" }}>
            Simulador de jubilación · Argentina
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#059669" }}>
            Calculá tu plan gratis →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
