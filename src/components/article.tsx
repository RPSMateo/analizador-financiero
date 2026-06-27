import Link from "next/link";
import type { Metadata } from "next";

/**
 * Piezas compartidas para los artículos SEO (cluster de contenido).
 *
 * Centralizan nav, footer, metadata y JSON-LD para que cada artículo solo
 * aporte su contenido y mantenga un estilo visual coherente con el resto del
 * sitio (minimal/premium: blanco amplio, tracking ajustado, acento esmeralda,
 * cifras en monoespaciada).
 */

const BASE = "https://retirolibre.com.ar";

interface ArticleMeta {
  titulo: string;
  descripcion: string;
  urlPath: string;
}

/** Metadata de Next coherente para todos los artículos. */
export function articleMetadata({ titulo, descripcion, urlPath }: ArticleMeta): Metadata {
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: urlPath },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: urlPath,
      siteName: "RetiroLibre",
      locale: "es_AR",
      type: "article",
      // Definir openGraph propio resetea la imagen heredada del archivo
      // opengraph-image.tsx, así que la referenciamos explícitamente.
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: ["/opengraph-image"],
    },
  };
}

interface FaqItem {
  pregunta: string;
  respuesta: string;
}

/** JSON-LD Article + FAQPage, listo para inyectar en un <script>. */
export function articleJsonLd({
  titulo,
  descripcion,
  urlPath,
  faqs,
  datePublished = "2026-06-25",
  dateModified = "2026-06-25",
}: ArticleMeta & { faqs: FaqItem[]; datePublished?: string; dateModified?: string }) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: titulo,
      description: descripcion,
      inLanguage: "es-AR",
      datePublished,
      dateModified,
      author: { "@type": "Organization", name: "RetiroLibre" },
      publisher: { "@type": "Organization", name: "RetiroLibre" },
      mainEntityOfPage: `${BASE}${urlPath}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.pregunta,
        acceptedAnswer: { "@type": "Answer", text: f.respuesta },
      })),
    },
  ];
}

/** Marco completo: nav + article + footer. */
export function ArticleShell({
  jsonLd,
  eyebrow,
  titulo,
  actualizado = "junio de 2026",
  children,
}: {
  jsonLd: object;
  eyebrow: string;
  titulo: string;
  actualizado?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight text-gray-950"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            RetiroLibre
          </Link>
          <Link
            href="/simulador"
            className="text-sm font-medium text-white bg-gray-950 hover:bg-gray-800 px-4 py-2 rounded-full transition-colors"
          >
            Calcular gratis
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
        <p className="text-sm text-emerald-600 font-medium mb-3">{eyebrow}</p>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gray-950 leading-[1.08] mb-4">
          {titulo}
        </h1>
        <p className="text-sm text-gray-400 mb-10">Actualizado a {actualizado}</p>
        {children}
      </article>

      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
          <p className="flex items-center gap-2 font-semibold tracking-tight text-gray-950">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            RetiroLibre
          </p>
          <p className="text-gray-400">
            Los cálculos son estimativos y no constituyen asesoramiento financiero.
          </p>
        </div>
      </footer>
    </main>
  );
}

/** Recuadro de "respuesta corta" — apunta al featured snippet de Google. */
export function RespuestaCorta({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-emerald-500 bg-emerald-50/50 rounded-r-xl px-5 py-4 mb-10 text-gray-800 leading-relaxed [&_strong]:text-gray-950 [&_strong]:font-semibold">
      {children}
    </div>
  );
}

export function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-950 mb-3">
        {titulo}
      </h2>
      <div className="space-y-4 text-gray-600 leading-relaxed [&_strong]:text-gray-950 [&_strong]:font-medium [&_a]:text-emerald-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-emerald-700">
        {children}
      </div>
    </section>
  );
}

/** CTA intermedio destacado en esmeralda. */
export function CTA({
  titulo,
  texto,
  boton = "Calcular mi plan →",
}: {
  titulo: string;
  texto: string;
  boton?: string;
}) {
  return (
    <div className="bg-emerald-600 rounded-2xl p-7 my-12 text-center">
      <h2 className="text-xl font-semibold tracking-tight text-white mb-2">{titulo}</h2>
      <p className="text-emerald-50 text-sm mb-6 max-w-md mx-auto leading-relaxed">{texto}</p>
      <Link
        href="/simulador"
        className="inline-block bg-white text-emerald-700 font-medium px-6 py-3 rounded-full hover:bg-emerald-50 transition-colors"
      >
        {boton}
      </Link>
    </div>
  );
}

/** Bloque de preguntas frecuentes (debe coincidir con el FAQPage del JSON-LD). */
export function FAQ({ faqs }: { faqs: FaqItem[] }) {
  return (
    <Seccion titulo="Preguntas frecuentes">
      <div className="divide-y divide-gray-100 border-y border-gray-100">
        {faqs.map((f) => (
          <div key={f.pregunta} className="py-5">
            <h3 className="font-medium text-gray-950 mb-1.5">{f.pregunta}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{f.respuesta}</p>
          </div>
        ))}
      </div>
    </Seccion>
  );
}

/** Enlaces a otros artículos del cluster (internal linking para SEO). */
export function ArticulosRelacionados({
  articulos,
}: {
  articulos: { href: string; titulo: string }[];
}) {
  return (
    <Seccion titulo="Seguí leyendo">
      <ul className="space-y-2 not-prose">
        {articulos.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              {a.titulo} →
            </Link>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}

/** Tabla simple con cabecera gris y cifras en monoespaciada. */
export function Tabla({
  columnas,
  filas,
}: {
  columnas: string[];
  filas: string[][];
}) {
  return (
    <div className="overflow-x-auto my-5 rounded-xl border border-gray-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-left">
            {columnas.map((c, i) => (
              <th key={c} className={`p-3 font-medium ${i > 0 ? "text-right" : ""}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, r) => (
            <tr key={r} className="border-t border-gray-100">
              {fila.map((celda, i) => (
                <td
                  key={i}
                  className={`p-3 ${
                    i === 0
                      ? "text-gray-700"
                      : "text-right font-mono tabular-nums text-gray-950"
                  }`}
                >
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
