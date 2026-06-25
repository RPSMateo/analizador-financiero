import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-950">
      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold tracking-tight text-gray-950">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            RetiroLibre
          </span>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="#precios"
              className="hidden sm:inline-block text-sm text-gray-500 hover:text-gray-950 px-3 py-2 transition-colors"
            >
              Precios
            </Link>
            <Link
              href="/jubilacion-monotributista"
              className="hidden sm:inline-block text-sm text-gray-500 hover:text-gray-950 px-3 py-2 transition-colors"
            >
              Guía
            </Link>
            <Link
              href="/simulador"
              className="text-sm font-medium text-white bg-gray-950 hover:bg-gray-800 px-4 py-2 rounded-full transition-colors"
            >
              Calcular gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-28 text-center">
        <span className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Para autónomos y freelancers argentinos
        </span>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-gray-950 leading-[1.05] mb-6">
          Sabé exactamente cuánto
          <br className="hidden sm:block" /> necesitás ahorrar para{" "}
          <span className="text-emerald-600">jubilarte</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
          El sistema previsional argentino no fue diseñado para freelancers.
          Calculamos lo que el Estado no te va a dar y cuánto tenés que ahorrar
          vos mismo —con inflación real y tres escenarios de inversión.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/simulador"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-7 py-3.5 rounded-full text-base transition-colors"
          >
            Calculá tu plan gratis
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="#precios"
            className="w-full sm:w-auto inline-flex items-center justify-center border border-gray-200 hover:border-gray-300 text-gray-700 font-medium px-7 py-3.5 rounded-full text-base transition-colors"
          >
            Ver precios
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-5">Sin registro. Sin tarjeta. En 2 minutos.</p>
      </section>

      {/* Problema — datos en mono como ancla visual */}
      <section className="border-t border-gray-100 py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm font-medium text-emerald-600 mb-3">El problema</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-950 mb-12 max-w-lg">
            Lo que nadie te cuenta sobre jubilarte siendo independiente
          </h2>
          <div className="grid sm:grid-cols-3 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {[
              {
                dato: "20%",
                titulo: "La jubilación estatal no alcanza",
                texto:
                  "La mayoría de los monotributistas cobra el haber mínimo, gane lo que gane. Si facturás $2M/mes, el Estado te cubre apenas una quinta parte.",
              },
              {
                dato: "$403K",
                titulo: "El haber mínimo, gane lo que gane",
                texto:
                  "Ahorrar en pesos sin invertir bien equivale a perder poder adquisitivo cada año. Necesitás una estrategia, no solo guardar plata.",
              },
              {
                dato: "2×",
                titulo: "El tiempo es tu activo más valioso",
                texto:
                  "Empezar a los 35 requiere el doble de ahorro mensual que empezar a los 25. Cada año que pasa te cuesta caro.",
              },
            ].map((item) => (
              <div key={item.titulo} className="bg-white p-8">
                <p className="font-mono text-4xl font-medium text-gray-950 tracking-tight mb-5">
                  {item.dato}
                </p>
                <h3 className="font-medium text-gray-950 mb-2">{item.titulo}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="border-t border-gray-100 py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm font-medium text-emerald-600 mb-3">Cómo funciona</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-950 mb-12">
            De la incertidumbre a un plan concreto
          </h2>
          <div className="divide-y divide-gray-100 border-y border-gray-100">
            {[
              {
                paso: "01",
                titulo: "Ingresás tus datos",
                texto:
                  "Edad, ingresos, ahorros actuales y situación laboral. Sin datos bancarios ni información sensible.",
              },
              {
                paso: "02",
                titulo: "Calculamos tu brecha previsional",
                texto:
                  "Estimamos lo que el Estado argentino te va a pagar y cuánto necesitás cubrir vos mismo.",
              },
              {
                paso: "03",
                titulo: "Ves 3 escenarios de inversión",
                texto:
                  "Conservador, moderado y optimista, con tasas reales argentinas y proyección año a año hasta tu retiro.",
              },
            ].map((item) => (
              <div key={item.paso} className="flex gap-6 sm:gap-10 py-6">
                <span className="font-mono text-sm text-emerald-600 pt-1 tabular-nums">
                  {item.paso}
                </span>
                <div>
                  <h3 className="font-medium text-gray-950 mb-1">{item.titulo}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="border-t border-gray-100 py-20 sm:py-24 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-sm font-medium text-emerald-600 mb-3 text-center">Precios</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-950 text-center mb-3">
            Empezá gratis. Desbloqueá una sola vez.
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-md mx-auto">
            Sin suscripciones ni renovaciones. Pagás una vez y tenés tu plan completo para siempre.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {/* Gratis */}
            <div className="rounded-2xl border border-gray-200 p-8 flex flex-col">
              <h3 className="font-medium text-gray-950 mb-1">Gratis</h3>
              <p className="text-gray-500 text-sm mb-6">Para entender tu situación</p>
              <p className="font-mono text-4xl font-medium text-gray-950 tracking-tight mb-8">$0</p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
                {[
                  "Simulador completo",
                  "Resultado en escenario moderado",
                  "Estimación de jubilación estatal",
                  "Cálculo de tu brecha previsional",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="text-gray-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/simulador"
                className="block text-center border border-gray-200 hover:border-gray-300 text-gray-950 font-medium py-3 rounded-full transition-colors"
              >
                Empezar gratis
              </Link>
            </div>

            {/* Pro — destacada en oscuro */}
            <div className="relative rounded-2xl bg-gray-950 p-8 text-white flex flex-col">
              <span className="absolute top-6 right-6 text-[11px] font-medium text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-full">
                Pago único
              </span>
              <h3 className="font-medium mb-1">Pro</h3>
              <p className="text-gray-400 text-sm mb-6">Para tomar decisiones reales</p>
              <p className="font-mono text-4xl font-medium tracking-tight mb-1">
                $9.990
              </p>
              <p className="text-gray-400 text-xs mb-8">Una sola vez · acceso para siempre</p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8 flex-1">
                {[
                  "Todo lo del plan gratuito",
                  "3 escenarios de inversión",
                  "Proyección año a año",
                  "Plan de acción: en qué invertir",
                  "Exportar tu plan a PDF",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/simulador"
                className="block text-center bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold py-3 rounded-full transition-colors"
              >
                Desbloquear mi plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA de cierre */}
      <section className="border-t border-gray-100 py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-950 mb-5">
            Tu yo de 65 años te lo va a agradecer
          </h2>
          <p className="text-lg text-gray-500 mb-9 max-w-lg mx-auto leading-relaxed">
            En 2 minutos sabés cuánto te falta y cómo cubrirlo. Es gratis y no
            necesitás registrarte.
          </p>
          <Link
            href="/simulador"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-4 rounded-full text-base transition-colors"
          >
            Calculá tu plan ahora
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-14">
        <div className="max-w-5xl mx-auto px-6 grid sm:grid-cols-2 gap-10 text-sm">
          <div>
            <p className="flex items-center gap-2 font-semibold tracking-tight text-gray-950 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              RetiroLibre
            </p>
            <p className="text-gray-400 max-w-xs leading-relaxed">
              El simulador de jubilación para autónomos y freelancers argentinos. Los cálculos
              son estimativos y no constituyen asesoramiento financiero.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-950 mb-3">Guías</p>
            <ul className="space-y-2.5">
              {[
                { href: "/jubilacion-monotributista", t: "¿Cuánto cobra de jubilación un monotributista?" },
                { href: "/jubilacion-autonomos", t: "Jubilación de autónomos: cuánto se cobra y requisitos" },
                { href: "/cuanto-ahorrar-para-jubilarse", t: "¿Cuánto necesito ahorrar para jubilarme?" },
                { href: "/como-invertir-para-la-jubilacion", t: "Cómo invertir para el retiro en Argentina" },
              ].map((g) => (
                <li key={g.href}>
                  <Link href={g.href} className="text-gray-500 hover:text-gray-950 transition-colors">
                    {g.t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${className}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
