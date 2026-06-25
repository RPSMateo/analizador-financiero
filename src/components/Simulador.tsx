"use client";

import { useState, useEffect } from "react";
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
import PlanReport from "@/components/PlanReport";
import GrowthChart from "@/components/GrowthChart";
import ComparacionEscenarios from "@/components/ComparacionEscenarios";
import PlanAccion from "@/components/PlanAccion";

const LS_KEY = "retirolibre_pro_v1";

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
  const [proDesbloqueado, setProDesbloqueado] = useState(false);
  const [pagoCargando, setPagoCargando] = useState(false);
  const [pagoMensaje, setPagoMensaje] = useState<"ok" | "error" | "pendiente" | null>(null);

  useEffect(() => {
    // Verificar si ya pagó en una sesión anterior
    if (localStorage.getItem(LS_KEY) === "true") {
      setProDesbloqueado(true);
    }

    // Detectar retorno desde Mercado Pago
    const params = new URLSearchParams(window.location.search);
    const pago = params.get("pago");
    if (pago === "ok") {
      localStorage.setItem(LS_KEY, "true");
      setProDesbloqueado(true);
      setPagoMensaje("ok");
      // Limpiar la URL sin recargar la página
      window.history.replaceState(null, "", window.location.pathname);
    } else if (pago === "error") {
      setPagoMensaje("error");
      window.history.replaceState(null, "", window.location.pathname);
    } else if (pago === "pendiente") {
      setPagoMensaje("pendiente");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  function actualizarSexo(sexo: Sexo) {
    setInputs({ ...inputs, sexo, edadRetiro: edadJubilacionLegal(sexo) });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResultado(calcularSimulacion(inputs));
  }

  function descargarPDF() {
    window.print();
  }

  async function iniciarPago() {
    setPagoCargando(true);
    try {
      const res = await fetch("/api/pago/crear", { method: "POST" });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("No se pudo iniciar el pago. Intentá de nuevo.");
      }
    } catch {
      alert("Error de red. Intentá de nuevo.");
    } finally {
      setPagoCargando(false);
    }
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
          {/* Banner de pago exitoso */}
          {pagoMensaje === "ok" && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold text-emerald-800">¡Pago confirmado! Tu plan completo está desbloqueado.</p>
                <p className="text-sm text-emerald-600">Ahora podés ver los 3 escenarios, el plan de acción y descargar el PDF.</p>
              </div>
            </div>
          )}
          {pagoMensaje === "pendiente" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              Tu pago está siendo procesado. Revisá tu email en unos minutos y recargá la página.
            </div>
          )}
          {pagoMensaje === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-800">
              El pago no se completó. Podés intentarlo de nuevo cuando quieras.
            </div>
          )}

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

          {/* Advertencia 30 años de aportes */}
          {!resultado.cumpleAniosAportes && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
              ⚠️ <strong>Atención:</strong> con la edad de retiro elegida podrías no llegar a los 30 años
              de aportes que exige la ley. Sin ellos, solo accederías a la PUAM (80% del haber mínimo).
              Considéralo en tu planificación.
            </div>
          )}

          {/* ─── Plan completo (Pro) ─── */}
          {proDesbloqueado ? (
            <>
              {/* Selector de escenarios */}
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

                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Crecimiento de tu capital hasta el retiro
                    </p>
                    <GrowthChart proyeccion={escenario.proyeccion} />
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-3">
                      Cuánto necesitás ahorrar en cada escenario
                    </p>
                    <ComparacionEscenarios
                      conservador={resultado.escenarios.conservador}
                      moderado={resultado.escenarios.moderado}
                      optimista={resultado.escenarios.optimista}
                    />
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Tu plan de acción — en qué poner ese ahorro
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Cómo repartir {formatearPesos(escenario.ahorroMensualNecesario)}/mes según el
                      perfil {escenario.nombre.toLowerCase()}.
                    </p>
                    <PlanAccion
                      escenario={escenarioActivo}
                      ahorroMensual={escenario.ahorroMensualNecesario}
                    />
                  </div>
                </div>
              </div>

              {/* Descargar PDF */}
              <button
                onClick={descargarPDF}
                className="w-full flex items-center justify-center gap-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold py-3 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                </svg>
                Descargar mi plan en PDF
              </button>
            </>
          ) : (
            /* ─── Paywall ─── */
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Preview borrosa del contenido Pro */}
              <div className="relative">
                <div className="blur-sm pointer-events-none select-none p-6 space-y-4">
                  <div className="flex gap-2">
                    {["conservador", "moderado", "optimista"].map((e) => (
                      <div key={e} className="flex-1 py-3 rounded-lg bg-gray-100 text-center text-sm text-gray-400 capitalize">{e}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="rounded-xl bg-gray-50 h-16" />
                    ))}
                  </div>
                  <div className="rounded-xl bg-gray-50 h-32" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/80" />
              </div>

              {/* CTA de pago */}
              <div className="px-8 pb-8 pt-2 text-center">
                <div className="text-3xl mb-3">🔐</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Desbloqueá tu plan completo
                </h3>
                <p className="text-sm text-gray-500 mb-5 max-w-sm mx-auto">
                  Una sola vez, sin suscripción. Accedés a todo para siempre.
                </p>

                <ul className="text-left text-sm text-gray-600 space-y-2 mb-6 max-w-xs mx-auto">
                  {[
                    "3 escenarios con proyección año a año",
                    "Comparación visual conservador vs. optimista",
                    "Plan de acción: en qué instrumento invertir cada mes",
                    "Informe PDF completo para guardar e imprimir",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={iniciarPago}
                  disabled={pagoCargando}
                  className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors text-base"
                >
                  {pagoCargando ? "Redirigiendo..." : "Desbloquear mi plan — $9.990 ARS"}
                </button>
                <p className="text-xs text-gray-400 mt-3">
                  Pago seguro con Mercado Pago · tarjetas, débito o saldo MP
                </p>
              </div>
            </div>
          )}

          {/* Nota metodológica */}
          <p className="text-xs text-gray-400 leading-relaxed">
            Todos los montos están expresados en pesos de hoy (poder adquisitivo constante). Los cálculos
            usan tasas de retorno reales (por encima de la inflación) y parámetros del sistema previsional
            argentino a junio 2026. Son estimaciones y no constituyen asesoramiento financiero.
          </p>

          {/* Informe imprimible — solo disponible en plan Pro */}
          {proDesbloqueado && <PlanReport resultado={resultado} />}
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
