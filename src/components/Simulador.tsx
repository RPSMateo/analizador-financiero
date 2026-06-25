"use client";

import { useState } from "react";
import {
  calcularSimulacion,
  edadJubilacionLegal,
  formatearPesos,
  formatearPorcentaje,
  SimulatorInputs,
  ResultadoSimulacion,
  Sexo,
  SituacionLaboral,
} from "@/lib/calculator";
import WaitlistForm from "@/components/WaitlistForm";
import PlanReport from "@/components/PlanReport";
import GrowthChart from "@/components/GrowthChart";

const INPUTS_INICIALES: SimulatorInputs = {
  edadActual: 28,
  edadRetiro: 65,
  ingresoMensual: 800000,
  ahorroActual: 0,
  sexo: "hombre",
  situacion: "monotributista",
};

export default function Simulador() {
  const [inputs, setInputs] = useState<SimulatorInputs>(INPUTS_INICIALES);
  const [resultado, setResultado] = useState<ResultadoSimulacion | null>(null);
  const [escenarioActivo, setEscenarioActivo] = useState<"conservador" | "moderado" | "optimista">("moderado");
  const [mostrarBloqueo, setMostrarBloqueo] = useState(false);

  function actualizarSexo(sexo: Sexo) {
    // Al cambiar el sexo ajustamos la edad de retiro sugerida a la legal.
    setInputs({ ...inputs, sexo, edadRetiro: edadJubilacionLegal(sexo) });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResultado(calcularSimulacion(inputs));
    setMostrarBloqueo(false);
  }

  function descargarPDF() {
    // Abre el diálogo de impresión del navegador. El informe (PlanReport) está
    // oculto en pantalla y solo se vuelve visible al imprimir (ver globals.css),
    // así el usuario obtiene el plan completo con "Guardar como PDF".
    window.print();
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Edad actual</label>
              <input
                type="number"
                min={18}
                max={64}
                value={inputs.edadActual}
                onChange={(e) => setInputs({ ...inputs, edadActual: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Edad de retiro</label>
              <input
                type="number"
                min={inputs.edadActual + 1}
                max={75}
                value={inputs.edadRetiro}
                onChange={(e) => setInputs({ ...inputs, edadRetiro: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
            <div className="grid grid-cols-2 gap-3">
              {(["hombre", "mujer"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => actualizarSexo(s)}
                  className={`py-3 rounded-xl border text-sm font-medium capitalize transition-colors ${
                    inputs.sexo === s
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Determina la edad jubilatoria legal ({inputs.sexo === "mujer" ? "60" : "65"} años) y la
              esperanza de vida usada en el cálculo.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingreso mensual neto (ARS)</label>
            <input
              type="number"
              min={0}
              step={10000}
              value={inputs.ingresoMensual}
              onChange={(e) => setInputs({ ...inputs, ingresoMensual: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Lo que ingresás en promedio por mes, a valores de hoy</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ahorros / inversiones actuales (ARS)</label>
            <input
              type="number"
              min={0}
              step={10000}
              value={inputs.ahorroActual}
              onChange={(e) => setInputs({ ...inputs, ahorroActual: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Incluí todo tu capital ya invertido para el retiro</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tu situación laboral</label>
            <select
              value={inputs.situacion}
              onChange={(e) =>
                setInputs({ ...inputs, situacion: e.target.value as SituacionLaboral })
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
              en pesos de hoy · escenario moderado ({formatearPorcentaje(resultado.escenarios.moderado.retornoRealAnual)} real anual)
            </p>

            <div className="mt-5 pt-5 border-t border-emerald-100 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-emerald-600">El Estado te daría aprox.</p>
                <p className="font-bold text-emerald-900">
                  {formatearPesos(resultado.jubilacionEstatalMensual)}/mes
                </p>
                <p className="text-xs text-emerald-500">
                  {formatearPorcentaje(resultado.tasaReemplazoEstatal)} de tu ingreso actual
                </p>
              </div>
              <div>
                <p className="text-emerald-600">Brecha a cubrir vos</p>
                <p className="font-bold text-emerald-900">
                  {formatearPesos(resultado.brechaMensual)}/mes
                </p>
                <p className="text-xs text-emerald-500">
                  objetivo: 70% de tu ingreso ({formatearPesos(resultado.ingresoObjetivoRetiro)})
                </p>
              </div>
            </div>
          </div>

          {/* Descargar plan en PDF */}
          <button
            onClick={descargarPDF}
            className="w-full flex items-center justify-center gap-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold py-3 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
            </svg>
            Descargar mi plan en PDF
          </button>

          {/* Advertencia 30 años de aportes */}
          {!resultado.cumpleAniosAportes && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
              ⚠️ <strong>Atención:</strong> con la edad de retiro elegida podrías no llegar a los 30 años
              de aportes que exige la ley. Sin ellos, solo accederías a la PUAM (80% del haber mínimo).
              Considéralo en tu planificación.
            </div>
          )}

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
                      label="Capital a acumular (hoy)"
                      value={formatearPesos(escenario.capitalNecesario)}
                    />
                    <MetricCard
                      label="Retorno real anual"
                      value={formatearPorcentaje(escenario.retornoRealAnual)}
                    />
                    <MetricCard
                      label="Años de retiro cubiertos"
                      value={`${resultado.aniosEnRetiro} años (hasta ${resultado.expectativaVida})`}
                    />
                  </div>

                  {/* Gráfico de crecimiento del capital hacia la meta */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Crecimiento de tu capital hasta el retiro
                    </p>
                    <GrowthChart proyeccion={escenario.proyeccion} />
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
                    Conservador, moderado y optimista con proyección año a año, exportación a PDF y más.
                    Estamos por lanzar — dejá tu email y te damos acceso anticipado.
                  </p>
                  <div className="max-w-sm mx-auto">
                    <WaitlistForm
                      variante="oscuro"
                      origen="simulador-bloqueo"
                      situacion={resultado.inputs.situacion}
                      textoBoton="Quiero acceso"
                    />
                  </div>
                </div>
              </div>
            )}

            {!mostrarBloqueo && (
              <button
                onClick={() => setMostrarBloqueo(true)}
                className="mt-3 w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Ver qué incluye la versión completa →
              </button>
            )}
          </div>

          {/* Nota metodológica */}
          <p className="text-xs text-gray-400 leading-relaxed">
            Todos los montos están expresados en pesos de hoy (poder adquisitivo constante). Los cálculos
            usan tasas de retorno reales (por encima de la inflación) y parámetros del sistema previsional
            argentino a junio 2026. Son estimaciones y no constituyen asesoramiento financiero.
          </p>

          {/* Informe imprimible (oculto en pantalla, visible solo al imprimir) */}
          <PlanReport resultado={resultado} />
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
