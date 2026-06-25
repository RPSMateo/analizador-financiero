import type { MetadataRoute } from "next";

const BASE = "https://retirolibre.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: BASE, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/simulador`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${BASE}/jubilacion-monotributista`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
