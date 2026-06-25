import { Escenario, formatearPesos, formatearPorcentaje } from "@/lib/calculator";

/**
 * Comparación visual del ahorro mensual necesario en los 3 escenarios.
 * Muestra de un vistazo cuánto más hay que ahorrar yendo conservador frente a
 * optimista — es decir, el valor de asumir más riesgo (y retorno) a largo plazo.
 */

interface ComparacionProps {
  conservador: Escenario;
  moderado: Escenario;
  optimista: Escenario;
}

const COLOR: Record<string, string> = {
  Conservador: "#94a3b8",
  Moderado: "#059669",
  Optimista: "#0ea5e9",
};

export default function ComparacionEscenarios({ conservador, moderado, optimista }: ComparacionProps) {
  const escenarios = [conservador, moderado, optimista];
  const maxVal = Math.max(...escenarios.map((e) => e.ahorroMensualNecesario)) || 1;
  const ahorroOptimista = optimista.ahorroMensualNecesario;
  const ahorroConservador = conservador.ahorroMensualNecesario;
  const diferencia = Math.max(0, ahorroConservador - ahorroOptimista);

  return (
    <div>
      <div className="flex items-end justify-around gap-4 h-48">
        {escenarios.map((e) => {
          const altura = Math.max(6, (e.ahorroMensualNecesario / maxVal) * 100);
          return (
            <div key={e.nombre} className="flex flex-col items-center flex-1 h-full justify-end">
              <p className="text-sm font-bold text-gray-900 mb-1 whitespace-nowrap">
                {formatearPesos(e.ahorroMensualNecesario)}
              </p>
              <div
                className="w-full max-w-[72px] rounded-t-lg transition-all"
                style={{ height: `${altura}%`, backgroundColor: COLOR[e.nombre] ?? "#059669" }}
              />
              <p className="text-xs font-semibold text-gray-700 mt-2">{e.nombre}</p>
              <p className="text-[11px] text-gray-400">
                {formatearPorcentaje(e.retornoRealAnual)} real
              </p>
            </div>
          );
        })}
      </div>

      {diferencia > 0 && (
        <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
          Yendo <strong className="text-gray-700">optimista</strong> en vez de conservador ahorrás{" "}
          <strong className="text-emerald-600">{formatearPesos(diferencia)}/mes</strong> menos para
          la misma meta. Esa es la recompensa de tolerar más volatilidad en el largo plazo.
        </p>
      )}
    </div>
  );
}
