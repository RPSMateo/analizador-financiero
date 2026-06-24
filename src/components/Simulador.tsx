"use client";

import { useState } from "react";
import {
  calcularSimulacion,
  formatearPesos,
  formatearPorcentaje,
  SimulatorInputs,
  ResultadoSimulacion,
  Escenario,
} from "@/lib/calculator";

const INPUTS_INICIALES: SimulatorInputs = {
  edadActual: 28,
  edadRetiro: 65,
  ingresoMensual: 500000,
  ahorroActual: 0,
  categoriaMonotributo: "monotributista",
};

export default function Simulador() {
  const [inputs, setInputs] = useState<SimulatorInputs>(INPUTS_INICIALES);
  const [resultado, setResultado] = useState<ResultadoSimulacion | null>(null);
  const [escenarioActivo, setEscenarioActivo] = useState<"conservador" | "moderado" | "optimista">("moderado");
  const [mostrarBloqueo, setMostrarBloqueo] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = calcularSimulacion(inputs);
    setResultado(res);
    setMostrarBloqueo(false);
  }

  const escenario = resultado?.escenarios[escenarioActivo];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Formulario */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Tus datos</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edad actual
              </label>
              <input
                type="number"
                min={18}
                max={64}
                value={inputs.edadActual}
                onChange={(e) =>
                  setInputs({ ...inputs, edadActual: Number(e.target.value) })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edad de retiro deseada
              </label>
              <input
                type="number"
                min={inputs.edadActual + 1}
                max={85}
                value={inputs.edadRetiro}
                onChange={(e) =>
                  setInputs({ ...inputs, edadRetiro: Number(e.target.value) })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingreso mensual neto (ARS)
            </label>
            <input
              type="number"
              min={0}
              value={inputs.ingresoMensual}
              onChange={(e) =>
                setInputs({ ...inputs, ingresoMensual: Number(e.target.value) })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Lo que ingresa en promedio por mes</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ahorros actuales (ARS)
            </label>
            <input
              type="number"
              min={0}
              value={inputs.ahorroActual}
              onChange={(e) =>
                setInputs({ ...inputs, ahorroActual: Number(e.target.value) })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Incluí todos tus ahorros e inversiones actuales</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tu situación laboral
            </label>
            <select
              value={inputs.categoriaMonotributo}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  categoriaMonotributo: e.target.value as SimulatorInputs["categoriaMonotributo"],
                })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="monotributista">Monotributista / Freelancer</option>
              <option value="autonomo">Autónomo (AFIP)</option>
              <option value="relacion_dependencia">Relación de dependencia</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            Calcular mi plan de retiro
          </button>
        </form>
      </div>

      {/* Resultados */}
      {resultado && escenario && (
        <div className="space-y-6">
          {/* Resultado básico (tier gratuito) */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8">
            <p className="text-sm font-medium text-emerald-700 mb-1">
              Para retirarte a los {resultado.inputs.edadRetiro} años necesitás ahorrar
            </p>
            <p className="text-4xl font-bold text-emerald-900">
              {formatearPesos(resultado.escenarios.moderado.ahorroMensualNecesario)}
              <span className="text-lg font-normal text-emerald-700"> / mes</span>
            </p>
            <p className="text-sm text-emerald-600 mt-2">
              Capital total necesario: {formatearPesos(resultado.escenarios.moderado.capitalNecesario)}
            </p>
            <p className="text-xs text-emerald-500 mt-1">
              Escenario moderado · El Estado aportaría aprox. {formatearPesos(resultado.escenarios.moderado.aporteEstadoMensual)}/mes ({formatearPorcentaje(resultado.tasaReemplazoPrevisionArgentina)} de tu ingreso)
            </p>
          </div>

          {/* Selector de escenarios (tier pago — bloqueado) */}
          <div className="relative">
            <div className={mostrarBloqueo ? "blur-sm pointer-events-none select-none" : ""}>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-100">
                  {(["conservador", "moderado", "optimista"] as const).map((e) => (
                    <button
                      key={e}
                      onClick={() => setEscenarioActivo(e)}
                      className={`flex-1 py-3.5 text-sm font-medium capitalize transition-colors ${
                        escenarioActivo === e
                          ? "bg-emerald-600 text-white"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-500">{escenario.descripcion}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                      label="Ahorro mensual necesario"
                      value={formatearPesos(escenario.ahorroMensualNecesario)}
                      highlight
                    />
                    <MetricCard
                      label="Capital a acumular"
                      value={formatearPesos(escenario.capitalNecesario)}
                    />
                    <MetricCard
                      label="Retorno real anual estimado"
                      value={formatearPorcentaje(escenario.tasaRetornoReal)}
                    />
                    <MetricCard
                      label="Jubilación estatal estimada"
                      value={formatearPesos(escenario.aporteEstadoMensual) + "/mes"}
                    />
                  </div>

                  {/* Mini gráfico de barras */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 mb-3">Proyección de ahorros vs. meta</p>
                    <div className="space-y-1.5">
                      {escenario.proyeccionAhorros
                        .filter((_, i) => i % Math.ceil(escenario.proyeccionAhorros.length / 6) === 0)
                        .map((punto) => {
                          const pct = Math.min(100, (punto.ahorroAcumulado / punto.metaAcumulada) * 100);
                          return (
                            <div key={punto.edad} className="flex items-center gap-3">
                              <span className="text-xs text-gray-400 w-12">Edad {punto.edad}</span>
                              <div className="flex-1 bg-gray-100 rounded-full h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 w-8">{Math.round(pct)}%</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay de bloqueo */}
            {mostrarBloqueo && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-2xl">
                <div className="text-center px-8">
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Desbloqueá los 3 escenarios completos
                  </h3>
                  <p className="text-sm text-gray-500 mb-5">
                    Conservador, moderado y optimista con proyecciones año a año, exportación a PDF y más.
                  </p>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                    Empezar prueba gratis de 7 días →
                  </button>
                  <p className="text-xs text-gray-400 mt-3">Después $4.990/mes · Cancelá cuando quieras</p>
                </div>
              </div>
            )}

            {/* Botón para mostrar bloqueo (simulación de CTA) */}
            {!mostrarBloqueo && (
              <button
                onClick={() => setMostrarBloqueo(true)}
                className="mt-3 w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Ver qué incluye la versión completa →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? "bg-emerald-50 border border-emerald-100" : "bg-gray-50"}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? "text-emerald-700" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}
