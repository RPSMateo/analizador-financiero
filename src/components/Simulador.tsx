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

const INPUT_CLASS =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-950 font-mono tabular-nums " +
  "focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors";

export default function Simulador() {
  const [inputs, setInputs] = useState<SimulatorInputs>(INPUTS_INICIALES);
  const [rawIngreso, setRawIngreso] = useState(String(INPUTS_INICIALES.ingresoMensual));
  const [rawAhorro, setRawAhorro] = useState(String(INPUTS_INICIALES.ahorroActual));
  const [inputError, setInputError] = useState<string | null>(null);
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
    if (!inputs.ingresoMensual || inputs.ingresoMensual <= 0) {
      setInputError("Ingresá tu ingreso mensual para calcular.");
      return;
    }
    setInputError(null);
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
        alert(data.error ?? "No se pudo iniciar el pago. Intentá de nuevo.");
      }
    } catch {
      alert("Error de red. Intentá de nuevo.");
    } finally {
      setPagoCargando(false);
    }
  }

  const escenario = resultado?.escenarios[escenarioActivo];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Formulario */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-medium tracking-tight text-gray-950 mb-6">Tus datos</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Edad actual</label>
              <input
                type="number"
                min={18}
                max={64}
                value={inputs.edadActual}
                onChange={(e) => setInputs({ ...inputs, edadActual: Number(e.target.value) })}
                className={INPUT_CLASS}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Edad de retiro</label>
              <input
                type="number"
                min={inputs.edadActual + 1}
                max={75}
                value={inputs.edadRetiro}
                onChange={(e) => setInputs({ ...inputs, edadRetiro: Number(e.target.value) })}
                className={INPUT_CLASS}
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
            <p className="text-xs text-gray-400 mt-1.5">
              Determina la edad jubilatoria legal ({inputs.sexo === "mujer" ? "60" : "65"} años) y la
              esperanza de vida usada en el cálculo.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ingreso mensual neto (ARS)</label>
            <input
              type="number"
              min={0}
              step={10000}
              value={rawIngreso}
              onChange={(e) => {
                setRawIngreso(e.target.value);
                const num = e.target.value === "" ? 0 : Number(e.target.value);
                if (!isNaN(num)) setInputs((prev) => ({ ...prev, ingresoMensual: num }));
              }}
              onBlur={() => {
                if (rawIngreso === "") setRawIngreso("0");
              }}
              className={INPUT_CLASS + (inputError ? " border-red-400 focus:border-red-400 focus:ring-red-400" : "")}
              placeholder="Ej: 800000"
            />
            {inputError && <p className="text-xs text-red-500 mt-1.5">{inputError}</p>}
            {!inputError && <p className="text-xs text-gray-400 mt-1.5">Lo que ingresás en promedio por mes, a valores de hoy</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ahorros / inversiones actuales (ARS)</label>
            <input
              type="number"
              min={0}
              step={10000}
              value={rawAhorro}
              onChange={(e) => {
                setRawAhorro(e.target.value);
                const num = e.target.value === "" ? 0 : Number(e.target.value);
                if (!isNaN(num)) setInputs((prev) => ({ ...prev, ahorroActual: num }));
              }}
              onBlur={() => {
                if (rawAhorro === "") setRawAhorro("0");
              }}
              className={INPUT_CLASS}
              placeholder="0"
            />
            <p className="text-xs text-gray-400 mt-1.5">Incluí todo tu capital ya invertido para el retiro</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tu situación laboral</label>
            <select
              value={inputs.situacion}
              onChange={(e) =>
                setInputs({ ...inputs, situacion: e.target.value as SituacionLaboral })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-950 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            >
              <option value="monotributista">Monotributista / Freelancer</option>
              <option value="autonomo">Autónomo (AFIP)</option>
              <option value="relacion_dependencia">Relación de dependencia</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 rounded-full transition-colors"
          >
            Calcular mi plan de retiro
          </button>
        </form>
      </div>

      {/* Resultados */}
      {resultado && escenario && (
        <div className="space-y-5">
          {/* Banner de pago */}
          {pagoMensaje === "ok" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
              <CircleCheck />
              <div>
                <p className="font-medium text-emerald-900">¡Pago confirmado! Tu plan completo está desbloqueado.</p>
                <p className="text-sm text-emerald-700">Ahora podés ver los 3 escenarios, el plan de acción y descargar el PDF.</p>
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

          {/* Resultado básico (tier gratuito) — número héroe en mono */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Para retirarte a los {resultado.inputs.edadRetiro} años necesitás ahorrar
            </p>
            <p className="font-mono text-4xl sm:text-5xl font-medium tracking-tight text-emerald-600">
              {formatearPesos(resultado.escenarios.moderado.ahorroMensualNecesario)}
              <span className="text-lg font-sans font-normal text-gray-400"> /mes</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              en pesos de hoy · escenario moderado ({formatearPorcentaje(resultado.escenarios.moderado.retornoRealAnual)} real anual)
            </p>

            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">El Estado te daría aprox.</p>
                <p className="font-mono text-lg font-medium text-gray-950 tabular-nums">
                  {formatearPesos(resultado.jubilacionEstatalMensual)}<span className="text-gray-400">/mes</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatearPorcentaje(resultado.tasaReemplazoEstatal)} de tu ingreso actual
                </p>
              </div>
              <div className="sm:border-l sm:border-gray-100 sm:pl-6">
                <p className="text-sm text-gray-500 mb-1">Brecha a cubrir vos</p>
                <p className="font-mono text-lg font-medium text-emerald-600 tabular-nums">
                  {formatearPesos(resultado.brechaMensual)}<span className="text-emerald-400">/mes</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  objetivo: 70% de tu ingreso ({formatearPesos(resultado.ingresoObjetivoRetiro)})
                </p>
              </div>
            </div>
          </div>

          {/* Advertencia 30 años de aportes */}
          {!resultado.cumpleAniosAportes && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800 leading-relaxed">
              <strong className="font-medium">Atención:</strong> con la edad de retiro elegida podrías no llegar a los 30 años
              de aportes que exige la ley. Sin ellos, solo accederías a la PUAM (80% del haber mínimo).
              Considéralo en tu planificación.
            </div>
          )}

          {/* ─── Plan completo (Pro) ─── */}
          {proDesbloqueado ? (
            <>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                {/* Selector de escenarios — segmented control */}
                <div className="p-4 sm:p-5 border-b border-gray-100">
                  <div className="bg-gray-100 rounded-full p-1 flex gap-1">
                    {(["conservador", "moderado", "optimista"] as const).map((e) => (
                      <button
                        key={e}
                        onClick={() => setEscenarioActivo(e)}
                        className={`flex-1 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                          escenarioActivo === e
                            ? "bg-white text-gray-950 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-500">{escenario.descripcion}</p>

                  <div className="grid grid-cols-2 gap-3">
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
                      value={`${resultado.aniosEnRetiro} (hasta ${resultado.expectativaVida})`}
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
                    <p className="text-sm font-medium text-gray-950 mb-1">
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
                className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-950 font-medium py-3 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                </svg>
                Descargar mi plan en PDF
              </button>
            </>
          ) : (
            /* ─── Paywall ─── */
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {/* Preview borrosa del contenido Pro */}
              <div className="relative">
                <div className="blur-sm pointer-events-none select-none p-6 space-y-4">
                  <div className="bg-gray-100 rounded-full p-1 flex gap-1">
                    {["conservador", "moderado", "optimista"].map((e) => (
                      <div key={e} className="flex-1 py-2 rounded-full bg-white/60 text-center text-sm text-gray-400 capitalize">{e}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 h-16" />
                    ))}
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 h-32" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white" />
              </div>

              {/* CTA de pago */}
              <div className="px-6 sm:px-8 pb-8 pt-2 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-950 mb-4">
                  <Lock />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-gray-950 mb-2">
                  Desbloqueá tu plan completo
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  Una sola vez, sin suscripción. Accedés a todo para siempre.
                </p>

                <ul className="text-left text-sm text-gray-600 space-y-2.5 mb-7 max-w-xs mx-auto">
                  {[
                    "3 escenarios con proyección año a año",
                    "Comparación visual conservador vs. optimista",
                    "Plan de acción: en qué instrumento invertir",
                    "Informe PDF completo para guardar e imprimir",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={iniciarPago}
                  disabled={pagoCargando}
                  className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-4 rounded-full transition-colors"
                >
                  {pagoCargando ? "Redirigiendo..." : (
                    <>Desbloquear — <span className="font-mono">$9.990</span></>
                  )}
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
    <div className={`rounded-xl border p-4 ${highlight ? "border-emerald-200 bg-emerald-50/50" : "border-gray-200 bg-white"}`}>
      <p className="text-xs text-gray-500 mb-1.5">{label}</p>
      <p className={`font-mono text-lg font-medium tracking-tight tabular-nums ${highlight ? "text-emerald-700" : "text-gray-950"}`}>
        {value}
      </p>
    </div>
  );
}

function Check() {
  return (
    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CircleCheck() {
  return (
    <svg className="w-6 h-6 flex-shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Lock() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round" />
    </svg>
  );
}
