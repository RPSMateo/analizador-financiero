"use client";

import { createPortal } from "react-dom";
import {
  formatearPesos,
  formatearPorcentaje,
  ResultadoSimulacion,
  SituacionLaboral,
  Sexo,
} from "@/lib/calculator";

/**
 * Informe imprimible del plan de retiro.
 *
 * Se monta vía portal como hijo directo de `<body>` y está oculto en pantalla
 * (`hidden`). Al imprimir, las reglas `@media print` de globals.css ocultan
 * todo lo demás y muestran solo este informe (clase `.plan-report`), evitando
 * páginas en blanco. Disparar `window.print()` desde el simulador genera el
 * PDF con el "Guardar como PDF" del navegador.
 */

const SITUACION_LABEL: Record<SituacionLaboral, string> = {
  monotributista: "Monotributista / Freelancer",
  autonomo: "Autónomo (AFIP)",
  relacion_dependencia: "Relación de dependencia",
};

const SEXO_LABEL: Record<Sexo, string> = {
  hombre: "Hombre",
  mujer: "Mujer",
};

function fechaHoy(): string {
  return new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Selecciona ~6 hitos equiespaciados de la proyección para una tabla compacta. */
function hitosProyeccion(proyeccion: ResultadoSimulacion["escenarios"]["moderado"]["proyeccion"]) {
  if (proyeccion.length <= 7) return proyeccion;
  const paso = Math.ceil(proyeccion.length / 6);
  const hitos = proyeccion.filter((_, i) => i % paso === 0);
  const ultimo = proyeccion[proyeccion.length - 1];
  if (hitos[hitos.length - 1]?.edad !== ultimo.edad) hitos.push(ultimo);
  return hitos;
}

export default function PlanReport({ resultado }: { resultado: ResultadoSimulacion }) {
  const { inputs, escenarios } = resultado;
  const moderado = escenarios.moderado;
  const hitos = hitosProyeccion(moderado.proyeccion);

  const escenariosOrdenados = [
    escenarios.conservador,
    escenarios.moderado,
    escenarios.optimista,
  ];

  // El portal a document.body solo existe en el cliente. Este componente se
  // renderiza únicamente tras el click del usuario (nunca en SSR), pero
  // guardamos por las dudas para no romper si se evaluara en el servidor.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="plan-report hidden bg-white text-gray-900 text-[13px] leading-relaxed">
      {/* Encabezado */}
      <header className="flex items-start justify-between border-b-2 border-emerald-600 pb-4 mb-6">
        <div>
          <p className="text-2xl font-bold text-emerald-700">RetiroLibre</p>
          <p className="text-gray-500 text-xs">
            Plan de retiro personalizado · estimación en pesos de hoy
          </p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p>Generado el {fechaHoy()}</p>
          <p>retirolibre.vercel.app</p>
        </div>
      </header>

      {/* Perfil */}
      <section className="plan-report-seccion mb-6">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
          Tu perfil
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <DatoPerfil label="Situación laboral" valor={SITUACION_LABEL[inputs.situacion]} />
          <DatoPerfil label="Sexo" valor={SEXO_LABEL[inputs.sexo]} />
          <DatoPerfil label="Ingreso mensual" valor={`${formatearPesos(inputs.ingresoMensual)}/mes`} />
          <DatoPerfil label="Edad actual" valor={`${inputs.edadActual} años`} />
          <DatoPerfil label="Edad de retiro" valor={`${inputs.edadRetiro} años`} />
          <DatoPerfil label="Ahorros actuales" valor={formatearPesos(inputs.ahorroActual)} />
          <DatoPerfil label="Años hasta el retiro" valor={`${resultado.aniosHastaRetiro} años`} />
          <DatoPerfil
            label="Años de retiro a cubrir"
            valor={`${resultado.aniosEnRetiro} (hasta ${resultado.expectativaVida})`}
          />
          <DatoPerfil
            label="Objetivo de ingreso"
            valor={`${formatearPesos(resultado.ingresoObjetivoRetiro)}/mes`}
          />
        </div>
      </section>

      {/* Brecha previsional */}
      <section className="plan-report-seccion mb-6">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
          La brecha previsional
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">El Estado te daría</p>
            <p className="text-lg font-bold text-gray-900">
              {formatearPesos(resultado.jubilacionEstatalMensual)}
            </p>
            <p className="text-xs text-gray-500">
              {formatearPorcentaje(resultado.tasaReemplazoEstatal)} de tu ingreso actual
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Tu objetivo (70%)</p>
            <p className="text-lg font-bold text-gray-900">
              {formatearPesos(resultado.ingresoObjetivoRetiro)}
            </p>
            <p className="text-xs text-gray-500">ingreso mensual deseado al jubilarte</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs text-emerald-700 mb-1">Brecha a cubrir vos</p>
            <p className="text-lg font-bold text-emerald-800">
              {formatearPesos(resultado.brechaMensual)}
            </p>
            <p className="text-xs text-emerald-600">lo que tenés que financiar con ahorro propio</p>
          </div>
        </div>

        {!resultado.cumpleAniosAportes && (
          <p className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <strong>Atención:</strong> con la edad de retiro elegida podrías no alcanzar los 30 años
            de aportes que exige la ley. Sin ellos solo accederías a la PUAM (80% del haber mínimo).
          </p>
        )}
      </section>

      {/* Escenarios */}
      <section className="plan-report-seccion mb-6">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
          Cuánto necesitás ahorrar — 3 escenarios
        </h2>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left">
              <th className="p-2 font-semibold">Escenario</th>
              <th className="p-2 font-semibold text-right">Retorno real anual</th>
              <th className="p-2 font-semibold text-right">Capital a acumular</th>
              <th className="p-2 font-semibold text-right">Ahorro mensual</th>
            </tr>
          </thead>
          <tbody>
            {escenariosOrdenados.map((e) => {
              const esModerado = e.nombre === moderado.nombre;
              return (
                <tr
                  key={e.nombre}
                  className={`border-b border-gray-100 ${esModerado ? "bg-emerald-50" : ""}`}
                >
                  <td className="p-2 font-semibold text-gray-900">
                    {e.nombre}
                    {esModerado && (
                      <span className="ml-1 text-[10px] font-normal text-emerald-600">
                        (recomendado)
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-right text-gray-700">
                    {formatearPorcentaje(e.retornoRealAnual)}
                  </td>
                  <td className="p-2 text-right text-gray-700">
                    {formatearPesos(e.capitalNecesario)}
                  </td>
                  <td className="p-2 text-right font-bold text-gray-900">
                    {formatearPesos(e.ahorroMensualNecesario)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-2 text-[11px] text-gray-400">
          {escenarios.conservador.descripcion} · {escenarios.optimista.descripcion}
        </p>
      </section>

      {/* Proyección por hitos (escenario moderado) */}
      <section className="plan-report-seccion mb-6">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
          Proyección de tu capital — escenario moderado
        </h2>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left">
              <th className="p-2 font-semibold">Edad</th>
              <th className="p-2 font-semibold text-right">Capital acumulado</th>
              <th className="p-2 font-semibold text-right">% de la meta</th>
            </tr>
          </thead>
          <tbody>
            {hitos.map((punto) => {
              const pct =
                moderado.capitalNecesario > 0
                  ? Math.min(100, (punto.ahorroAcumulado / moderado.capitalNecesario) * 100)
                  : 0;
              return (
                <tr key={punto.edad} className="border-b border-gray-100">
                  <td className="p-2 text-gray-700">{punto.edad} años</td>
                  <td className="p-2 text-right text-gray-700">
                    {formatearPesos(punto.ahorroAcumulado)}
                  </td>
                  <td className="p-2 text-right text-gray-700">{Math.round(pct)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Interpretación */}
      <section className="plan-report-seccion mb-6 rounded-lg bg-gray-50 p-4">
        <h2 className="text-sm font-bold text-gray-900 mb-2">Qué significa esto</h2>
        <p className="text-xs text-gray-600">
          Para mantener el 70% de tu ingreso actual al jubilarte
          ({formatearPesos(resultado.ingresoObjetivoRetiro)}/mes), el Estado solo cubriría
          {" "}{formatearPesos(resultado.jubilacionEstatalMensual)} — el{" "}
          {formatearPorcentaje(resultado.tasaReemplazoEstatal)} de lo que ganás hoy. La diferencia de{" "}
          {formatearPesos(resultado.brechaMensual)}/mes la tenés que cubrir vos. En un escenario
          moderado ({formatearPorcentaje(moderado.retornoRealAnual)} real anual), eso requiere ahorrar{" "}
          <strong>{formatearPesos(moderado.ahorroMensualNecesario)} por mes</strong> durante{" "}
          {resultado.aniosHastaRetiro} años, acumulando un capital de{" "}
          {formatearPesos(moderado.capitalNecesario)} (en pesos de hoy).
        </p>
      </section>

      {/* Nota metodológica + disclaimer */}
      <footer className="border-t border-gray-200 pt-3 text-[10px] text-gray-400 leading-relaxed">
        <p className="mb-1">
          <strong>Metodología:</strong> todos los montos están en pesos de hoy (poder adquisitivo
          constante). Se usan tasas de retorno reales (por encima de la inflación) y parámetros del
          sistema previsional argentino a junio 2026 (Ley 24.241, ANSES/INDEC, BCRA REM).
        </p>
        <p>
          Este informe es una estimación generada automáticamente y no constituye asesoramiento
          financiero ni previsional. RetiroLibre · retirolibre.vercel.app
        </p>
      </footer>
    </div>,
    document.body
  );
}

function DatoPerfil({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{valor}</p>
    </div>
  );
}
