import Link from "next/link";
import type { Metadata } from "next";

const URL_PATH = "/jubilacion-monotributista";
const TITULO = "¿Cuánto cobra de jubilación un monotributista en 2026?";
const DESCRIPCION =
  "Un monotributista cobra el haber mínimo: ~$403.318 por mes en 2026, gane lo que gane. Te explicamos por qué, los requisitos y cuánto necesitás ahorrar para cubrir la brecha.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: URL_PATH },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: URL_PATH,
    siteName: "RetiroLibre",
    locale: "es_AR",
    type: "article",
  },
};

// Tasa de reemplazo = haber mínimo ($403.318) sobre lo que facturás.
const FILAS_REEMPLAZO = [
  { facturas: "$500.000", cobra: "$403.318", reemplazo: "81%" },
  { facturas: "$800.000", cobra: "$403.318", reemplazo: "50%" },
  { facturas: "$1.500.000", cobra: "$403.318", reemplazo: "27%" },
  { facturas: "$3.000.000", cobra: "$403.318", reemplazo: "13%" },
];

const FAQS = [
  {
    pregunta: "¿Cuánto cobra de jubilación un monotributista en 2026?",
    respuesta:
      "En 2026 un monotributista cobra el haber mínimo, alrededor de $403.318 por mes (más los bonos que disponga ANSES). La gran mayoría cobra ese mínimo sin importar la categoría ni lo que facture.",
  },
  {
    pregunta: "¿Un monotributista que factura más cobra más jubilación?",
    respuesta:
      "No. El sistema calcula el haber sobre una renta presunta muy baja, por lo que casi todos los monotributistas terminan en el haber mínimo. Facturar el doble no se traduce en una jubilación mayor.",
  },
  {
    pregunta: "¿Cuántos años de aportes necesito para jubilarme como monotributista?",
    respuesta:
      "Se exigen 30 años de aportes y la edad legal (65 años los hombres, 60 las mujeres). Si no llegás a los 30 años, podés acceder a la PUAM, que equivale al 80% del haber mínimo (unos $322.654).",
  },
  {
    pregunta: "¿A qué edad se jubila un monotributista?",
    respuesta:
      "A la misma edad que el resto del sistema: 65 años los hombres y 60 las mujeres, siempre que se cumplan los 30 años de aportes.",
  },
  {
    pregunta: "¿Cómo se actualiza la jubilación mínima?",
    respuesta:
      "Desde 2024 la movilidad es mensual y sigue la inflación (IPC) con dos meses de rezago. Por eso el monto nominal sube, pero su poder adquisitivo se mantiene más o menos estable.",
  },
  {
    pregunta: "¿Cómo puedo mejorar mi jubilación si soy monotributista?",
    respuesta:
      "Como el Estado solo te garantiza el mínimo, la diferencia hay que cubrirla con ahorro e inversión propios. Cuanto antes empieces, menos necesitás ahorrar por mes. Podés calcular tu brecha y tu ahorro mensual con el simulador gratuito de RetiroLibre.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITULO,
    description: DESCRIPCION,
    inLanguage: "es-AR",
    datePublished: "2026-06-25",
    dateModified: "2026-06-25",
    author: { "@type": "Organization", name: "RetiroLibre" },
    publisher: { "@type": "Organization", name: "RetiroLibre" },
    mainEntityOfPage: `https://retirolibre.vercel.app${URL_PATH}`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: { "@type": "Answer", text: f.respuesta },
    })),
  },
];

export default function JubilacionMonotributistaPage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/" className="font-bold text-emerald-700 text-lg">
          RetiroLibre
        </Link>
        <Link
          href="/simulador"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Calcular gratis
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm text-emerald-700 font-medium mb-3">Jubilación · Monotributo</p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">{TITULO}</h1>
        <p className="text-sm text-gray-400 mb-8">Actualizado a junio de 2026</p>

        {/* Respuesta directa (apunta al featured snippet) */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-10">
          <p className="text-gray-800 leading-relaxed">
            <strong>Respuesta corta:</strong> en 2026 un monotributista cobra el{" "}
            <strong>haber mínimo, alrededor de $403.318 por mes</strong> (más los bonos que
            disponga ANSES), <strong>sin importar lo que facture</strong>. A diferencia de la
            relación de dependencia, facturar más no se traduce en una jubilación más alta.
          </p>
        </div>

        <Seccion titulo="Por qué casi todos los monotributistas cobran el mínimo">
          <p>
            La jubilación de un trabajador en relación de dependencia se calcula sobre sus
            sueldos reales. La del monotributista, en cambio, se calcula sobre una{" "}
            <strong>renta presunta</strong>: un valor fijo y bajo que asigna el sistema según la
            categoría, muy por debajo de lo que la mayoría factura en la práctica.
          </p>
          <p>
            El resultado es que, hagas la categoría que hagas, el haber que surge del cálculo
            casi siempre queda por debajo del piso legal. Y como nadie puede cobrar menos que el
            haber mínimo, <strong>terminás cobrando exactamente ese mínimo</strong>.
          </p>
        </Seccion>

        <Seccion titulo="Cuánto representa eso de tu ingreso actual (tasa de reemplazo)">
          <p>
            La <strong>tasa de reemplazo</strong> es qué porcentaje de tu ingreso de hoy te va a
            cubrir la jubilación. Para un monotributista, como el haber es fijo, cuanto más
            facturás, peor es la cobertura:
          </p>
          <div className="overflow-x-auto my-5">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left">
                  <th className="p-3 font-semibold">Si facturás por mes</th>
                  <th className="p-3 font-semibold text-right">El Estado te da</th>
                  <th className="p-3 font-semibold text-right">Tasa de reemplazo</th>
                </tr>
              </thead>
              <tbody>
                {FILAS_REEMPLAZO.map((f) => (
                  <tr key={f.facturas} className="border-b border-gray-100">
                    <td className="p-3 text-gray-700">{f.facturas}</td>
                    <td className="p-3 text-right text-gray-700">{f.cobra}</td>
                    <td className="p-3 text-right font-bold text-gray-900">{f.reemplazo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500">
            Para tener una jubilación cómoda se suele apuntar a una tasa de reemplazo del 70%. Un
            monotributista que factura $1.500.000 está cobrando apenas un 27%: hay una brecha
            enorme que tiene que cubrir por su cuenta.
          </p>
        </Seccion>

        {/* CTA intermedio */}
        <div className="bg-emerald-600 rounded-2xl p-6 my-10 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            ¿Querés saber tu brecha exacta?
          </h2>
          <p className="text-emerald-100 text-sm mb-5">
            El simulador calcula cuánto te daría el Estado según tu situación y cuánto necesitás
            ahorrar por mes para cubrir la diferencia. Gratis y en 2 minutos.
          </p>
          <Link
            href="/simulador"
            className="inline-block bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            Calcular mi jubilación →
          </Link>
        </div>

        <Seccion titulo="Requisitos para jubilarte como monotributista">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Edad:</strong> 65 años los hombres, 60 las mujeres.
            </li>
            <li>
              <strong>Aportes:</strong> 30 años de aportes al sistema. El pago mensual del
              monotributo ya incluye el componente jubilatorio.
            </li>
            <li>
              <strong>Si no llegás a los 30 años:</strong> podés acceder a la PUAM (Pensión
              Universal para el Adulto Mayor), que equivale al <strong>80% del haber mínimo</strong>{" "}
              (unos $322.654), a partir de los 65 años para ambos sexos.
            </li>
          </ul>
        </Seccion>

        <Seccion titulo="Cómo se actualiza el haber mínimo">
          <p>
            Desde 2024 la movilidad es <strong>mensual y sigue la inflación (IPC)</strong> con
            dos meses de rezago. Eso significa que el monto en pesos sube todos los meses, pero su
            poder de compra se mantiene relativamente estable. Por eso, cuando planificás a 20 o
            30 años, lo que importa no es el número nominal sino{" "}
            <strong>cuánto vale en pesos de hoy</strong> — el enfoque que usa nuestro simulador.
          </p>
        </Seccion>

        <Seccion titulo="Qué podés hacer para mejorar tu jubilación">
          <p>
            Si el Estado solo te garantiza el mínimo, la única forma de no perder nivel de vida al
            jubilarte es <strong>construir tu propio capital de retiro</strong> con ahorro e
            inversión. La buena noticia: el tiempo juega a tu favor. Empezar a los 30 requiere
            ahorrar mucho menos por mes que empezar a los 45, gracias al interés compuesto.
          </p>
          <p>
            El primer paso es ponerle números a tu situación: cuánto te va a dar el Estado, qué
            brecha te queda y cuánto necesitás ahorrar por mes para cerrarla en distintos
            escenarios de inversión.
          </p>
        </Seccion>

        <Seccion titulo="Preguntas frecuentes">
          <div className="space-y-5 not-prose">
            {FAQS.map((f) => (
              <div key={f.pregunta}>
                <h3 className="font-semibold text-gray-900 mb-1">{f.pregunta}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.respuesta}</p>
              </div>
            ))}
          </div>
        </Seccion>

        {/* CTA final */}
        <div className="border border-emerald-200 rounded-2xl p-6 mt-10 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Calculá tu plan de retiro gratis
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            Descubrí tu brecha previsional y cuánto necesitás ahorrar, con 3 escenarios de
            inversión y un informe en PDF para descargar.
          </p>
          <Link
            href="/simulador"
            className="inline-block bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Ir al simulador →
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-10 leading-relaxed">
          Los valores corresponden a estimaciones a junio de 2026 según parámetros del sistema
          previsional argentino (Ley 24.241, ANSES/INDEC). Este contenido es informativo y no
          constituye asesoramiento previsional ni financiero.
        </p>
      </article>

      <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-400">
        <p className="mb-1 font-medium text-gray-500">RetiroLibre</p>
        <p>Los cálculos son estimativos y no constituyen asesoramiento financiero.</p>
      </footer>
    </main>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{titulo}</h2>
      <div className="space-y-4 text-gray-700 leading-relaxed [&_strong]:text-gray-900">
        {children}
      </div>
    </section>
  );
}
