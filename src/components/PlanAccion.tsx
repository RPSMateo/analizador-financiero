import { CARTERAS, COLORES_CARTERA, EscenarioKey } from "@/lib/instrumentos";
import { formatearPesos } from "@/lib/calculator";

/**
 * "Plan de acción" del plan Pro: traduce el ahorro mensual de un escenario en
 * una asignación concreta entre instrumentos, con el monto a destinar a cada
 * uno. Componente de presentación puro (reutilizable en pantalla y en el PDF).
 */

interface PlanAccionProps {
  escenario: EscenarioKey;
  /** Ahorro mensual necesario en ese escenario (pesos de hoy). */
  ahorroMensual: number;
  /** Versión compacta para el PDF (sin barra apilada). */
  compacto?: boolean;
}

export default function PlanAccion({ escenario, ahorroMensual, compacto }: PlanAccionProps) {
  const cartera = CARTERAS[escenario];

  return (
    <div>
      {/* Barra apilada de asignación */}
      {!compacto && (
        <div className="flex w-full h-3 rounded-full overflow-hidden mb-4">
          {cartera.map((a, i) => (
            <div
              key={a.instrumento.nombre}
              style={{ width: `${a.porcentaje}%`, backgroundColor: COLORES_CARTERA[i] }}
            />
          ))}
        </div>
      )}

      <div className="space-y-3">
        {cartera.map((a, i) => {
          const monto = Math.round((ahorroMensual * a.porcentaje) / 100);
          return (
            <div key={a.instrumento.nombre} className="flex items-start gap-3">
              <span
                className="mt-1 w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COLORES_CARTERA[i] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold text-gray-900 text-sm">{a.instrumento.nombre}</p>
                  <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                    {formatearPesos(monto)}/mes
                    <span className="text-gray-400 font-normal"> · {a.porcentaje}%</span>
                  </p>
                </div>
                <p className="text-xs text-gray-500">{a.instrumento.descripcion}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
        Asignación ilustrativa según el perfil de riesgo del escenario. Es contenido educativo,
        no asesoramiento financiero: ajustá los instrumentos a tu situación y consultá a un
        profesional matriculado antes de invertir.
      </p>
    </div>
  );
}
