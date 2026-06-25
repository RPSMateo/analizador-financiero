import type { MetadataRoute } from "next";

const BASE = "https://retirolibre.vercel.app";

const ARTICULOS = [
  "/jubilacion-monotributista",
  "/jubilacion-autonomos",
  "/cuanto-ahorrar-para-jubilarse",
  "/como-invertir-para-la-jubilacion",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: BASE, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/simulador`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...ARTICULOS.map((path) => ({
      url: `${BASE}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
