import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="font-bold text-emerald-700 text-lg">RetiroLibre</span>
        <div className="flex items-center gap-6">
          <Link href="#precios" className="text-sm text-gray-500 hover:text-gray-900">
            Precios
          </Link>
          <Link
            href="/simulador"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Calcular gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <span className="inline-block bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Para autónomos y freelancers argentinos
        </span>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Sabé exactamente cuánto necesitás
          <br />
          <span className="text-emerald-600">ahorrar para jubilarte</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          El sistema previsional argentino no fue diseñado para freelancers. RetiroLibre
          calcula lo que el Estado no te va a dar y cuánto necesitás ahorrar vos mismo,
          con inflación real y tres escenarios de inversión.
        </p>
        <Link
          href="/simulador"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
        >
          Calculá tu plan gratis →
        </Link>
        <p className="text-sm text-gray-400 mt-4">Sin registro. Sin tarjeta. En 2 minutos.</p>
      </section>

      {/* Problema */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            El problema que nadie te cuenta
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                icon: "📉",
                titulo: "La jubilación estatal no alcanza",
                texto:
                  "La mayoría de los monotributistas cobra el haber mínimo (hoy ~$403.000), gane lo que gane. Si facturás $2.000.000/mes, el Estado te cubre apenas el 20%.",
              },
              {
                icon: "💸",
                titulo: "La inflación destruye tus ahorros",
                texto:
                  "Ahorrar en pesos sin invertir correctamente equivale a perder poder adquisitivo cada año. Necesitás una estrategia, no solo guardar.",
              },
              {
                icon: "⏰",
                titulo: "El tiempo es tu activo más valioso",
                texto:
                  "Empezar a los 25 requiere menos de la mitad del ahorro mensual que empezar a los 35. Cada año que pasa te cuesta caro.",
              },
            ].map((item) => (
              <div key={item.titulo} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.titulo}</h3>
                <p className="text-sm text-gray-500">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Cómo funciona
        </h2>
        <div className="space-y-8">
          {[
            {
              paso: "1",
              titulo: "Ingresás tus datos",
              texto: "Edad, ingresos, ahorros actuales y situación laboral. Sin datos bancarios ni información sensible.",
            },
            {
              paso: "2",
              titulo: "El simulador calcula tu brecha",
              texto: "Estimamos lo que el Estado argentino te pagará y calculamos cuánto necesitás cubrir vos mismo.",
            },
            {
              paso: "3",
              titulo: "Ves 3 escenarios de inversión",
              texto: "Conservador, moderado y optimista, con tasas reales argentinas y proyección año a año hasta tu retiro.",
            },
          ].map((item) => (
            <div key={item.paso} className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                {item.paso}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.titulo}</h3>
                <p className="text-gray-500">{item.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Precios</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="font-bold text-gray-900 text-xl mb-1">Gratis</h3>
              <p className="text-gray-500 text-sm mb-6">Para empezar a entender tu situación</p>
              <p className="text-3xl font-bold text-gray-900 mb-6">$0</p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {[
                  "Simulador básico",
                  "Resultado en escenario moderado",
                  "Estimación de jubilación estatal",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/simulador"
                className="block text-center border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold py-3 rounded-xl transition-colors"
              >
                Empezar gratis
              </Link>
            </div>

            <div className="bg-emerald-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                7 días gratis
              </div>
              <h3 className="font-bold text-xl mb-1">Pro</h3>
              <p className="text-emerald-200 text-sm mb-6">Para tomar decisiones reales</p>
              <p className="text-3xl font-bold mb-6">
                $4.990<span className="text-lg font-normal text-emerald-200">/mes</span>
              </p>
              <ul className="space-y-3 text-sm text-emerald-100 mb-8">
                {[
                  "Todo lo del plan gratuito",
                  "3 escenarios de inversión",
                  "Proyección año a año",
                  "Exportar plan a PDF",
                  "Actualización con inflación real",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-yellow-300">✓</span> {f}
                  </li>
                ))}
              </ul>
              <WaitlistForm
                variante="claro"
                origen="landing-precios"
                textoBoton="Quiero acceso"
              />
              <p className="text-xs text-emerald-300 mt-3 text-center">
                Estamos por lanzar — dejá tu email y sé de los primeros
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de espera */}
      <section className="bg-emerald-600 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Sé de los primeros en usarlo
          </h2>
          <p className="text-emerald-100 mb-8">
            Estamos abriendo el acceso de a poco. Dejá tu email y te avisamos apenas
            puedas desbloquear los escenarios completos y armar tu plan de retiro.
          </p>
          <div className="max-w-md mx-auto">
            <WaitlistForm variante="claro" origen="landing-cta" textoBoton="Anotarme" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-400">
        <p className="mb-1 font-medium text-gray-500">RetiroLibre</p>
        <p className="mb-3">
          <Link href="/jubilacion-monotributista" className="text-emerald-600 hover:text-emerald-700">
            ¿Cuánto cobra de jubilación un monotributista en 2026?
          </Link>
        </p>
        <p>Los cálculos son estimativos y no constituyen asesoramiento financiero.</p>
      </footer>
    </main>
  );
}
