import Link from "next/link";
import Simulador from "@/components/Simulador";

export const metadata = {
  title: "Simulador de Jubilación | RetiroLibre",
  description:
    "Calculá cuánto necesitás ahorrar para jubilarte como autónomo o freelancer en Argentina.",
};

export default function SimuladorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-emerald-700 text-lg">
          RetiroLibre
        </Link>
        <span className="text-sm text-gray-400">Simulador gratuito</span>
      </nav>

      <div className="max-w-3xl mx-auto px-4 pt-10 pb-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tu plan de retiro personalizado
        </h1>
        <p className="text-gray-500">
          Completá tus datos y calculamos cuánto necesitás ahorrar cada mes para
          jubilarte como querés.
        </p>
      </div>

      <Simulador />
    </div>
  );
}
