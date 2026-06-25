import Link from "next/link";
import Simulador from "@/components/Simulador";

export const metadata = {
  title: "Simulador de Jubilación | RetiroLibre",
  description:
    "Calculá cuánto necesitás ahorrar para jubilarte como autónomo o freelancer en Argentina.",
};

export default function SimuladorPage() {
  return (
    <div className="min-h-screen bg-white text-gray-950">
      {/* Nav coherente con la landing */}
      <nav className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight text-gray-950"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            RetiroLibre
          </Link>
          <span className="text-sm text-gray-400">Simulador gratuito</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-14 pb-2 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-950 mb-3">
          Tu plan de retiro personalizado
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
          Completá tus datos y calculamos cuánto necesitás ahorrar cada mes para
          jubilarte como querés.
        </p>
      </div>

      <Simulador />
    </div>
  );
}
