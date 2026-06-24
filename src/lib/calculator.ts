/**
 * Motor de cálculo actuarial — RetiroLibre
 *
 * Metodología: todos los cálculos se hacen en TÉRMINOS REALES (pesos de hoy,
 * a poder adquisitivo constante). Esto evita proyectar pesos nominales a 30-40
 * años — algo carente de sentido en una economía con la historia inflacionaria
 * argentina — y es el enfoque estándar en planificación previsional actuarial.
 * En consecuencia, las tasas de retorno usadas son REALES (por encima de la
 * inflación), no nominales.
 *
 * Parámetros del sistema previsional — actualizados a JUNIO 2026.
 * Fuentes:
 *  - Haber mínimo y PBU: ANSES (Res. 278/2025, movilidad IPC Decreto 274/2024)
 *  - Fórmula del haber: Ley 24.241 (PBU + PC + PAP)
 *  - Jubilación de monotributistas: ARCA / iProfesional (renta presunta)
 *  - Inflación proyectada: BCRA (REM) y FMI
 *  - Esperanza de vida y edades: ANSES / INDEC
 *
 * IMPORTANTE: estos valores deben revisarse periódicamente (la movilidad es
 * mensual). Están centralizados acá para facilitar su actualización.
 */

// ----------------------------------------------------------------------------
// Constantes del sistema previsional argentino (junio 2026, pesos de hoy)
// ----------------------------------------------------------------------------

/** Haber mínimo garantizado — junio 2026 (ANSES). Sin contar el bono de $70.000. */
const JUBILACION_MINIMA = 403_318;

/** Prestación Básica Universal — estimada junio 2026 ($143.780,36 ago-2025 + movilidad IPC). */
const PBU = 180_000;

/** Coeficiente de la Prestación Adicional por Permanencia: 1,5% por año aportado (Ley 24.241). */
const COEF_PAP = 0.015;

/** Años de aportes requeridos para la jubilación ordinaria. */
const ANIOS_APORTES_REQUERIDOS = 30;

/** Haber máximo aproximado — junio 2026 (estimado, tope del sistema). */
const HABER_MAXIMO = 2_750_000;

/** Premium estimado de un autónomo de categoría media sobre el haber mínimo. */
const FACTOR_AUTONOMO = 1.15;

/**
 * Tasas de retorno REALES anuales (por encima de la inflación) por escenario.
 * - Conservador: plazo fijo / bonos en pesos; apenas le gana a la inflación.
 * - Moderado: cartera mixta (pesos + activos dolarizados).
 * - Optimista: cartera dolarizada / CEDEARs del S&P 500.
 *   Referencia: el S&P 500 rindió ~7,8% real anual en dólares en los últimos 20 años.
 */
const RETORNO_REAL = {
  conservador: 0.02,
  moderado: 0.04,
  optimista: 0.07,
} as const;

/**
 * Inflación proyectada (solo informativa — no entra en el cálculo, que es real).
 * Fuente: BCRA REM jun-2026 y FMI. Trayectoria descendente.
 */
export const INFLACION_PROYECTADA = {
  anio2026: 0.305,
  anio2027: 0.199,
  largoPlazo: 0.08, // convergencia esperada hacia un dígito
};

/** Tasa de reemplazo objetivo estándar en planificación previsional. */
const TASA_REEMPLAZO_OBJETIVO = 0.70;

// ----------------------------------------------------------------------------
// Tipos
// ----------------------------------------------------------------------------

export type Sexo = "hombre" | "mujer";
export type SituacionLaboral = "monotributista" | "autonomo" | "relacion_dependencia";

export interface SimulatorInputs {
  edadActual: number;
  edadRetiro: number;
  ingresoMensual: number; // ARS, pesos de hoy
  ahorroActual: number; // ARS, pesos de hoy
  sexo: Sexo;
  situacion: SituacionLaboral;
}

export interface Escenario {
  nombre: string;
  descripcion: string;
  retornoRealAnual: number;
  capitalNecesario: number; // pesos de hoy
  ahorroMensualNecesario: number; // pesos de hoy
  proyeccion: ProyeccionAnual[];
}

export interface ProyeccionAnual {
  edad: number;
  ahorroAcumulado: number;
  meta: number;
}

export interface ResultadoSimulacion {
  inputs: SimulatorInputs;
  aniosHastaRetiro: number;
  aniosEnRetiro: number;
  expectativaVida: number;
  jubilacionEstatalMensual: number; // pesos de hoy
  tasaReemplazoEstatal: number; // fracción del ingreso que cubre el Estado
  ingresoObjetivoRetiro: number; // pesos de hoy
  brechaMensual: number; // lo que debe cubrir el ahorro privado
  cumpleAniosAportes: boolean;
  escenarios: {
    conservador: Escenario;
    moderado: Escenario;
    optimista: Escenario;
  };
}

// ----------------------------------------------------------------------------
// Parámetros demográficos
// ----------------------------------------------------------------------------

/** Edad jubilatoria legal por sexo (hombres 65, mujeres 60). */
export function edadJubilacionLegal(sexo: Sexo): number {
  return sexo === "mujer" ? 60 : 65;
}

/**
 * Esperanza de vida usada como horizonte de pago de la renta de retiro.
 * Basada en la esperanza de vida a los 65 en Argentina (ANSES/INDEC):
 * hombres ~83, mujeres ~87.
 */
function expectativaVida(sexo: Sexo): number {
  return sexo === "mujer" ? 87 : 83;
}

// ----------------------------------------------------------------------------
// Jubilación estatal estimada (pesos de hoy)
// ----------------------------------------------------------------------------

/**
 * Estima el haber jubilatorio estatal mensual según la situación laboral.
 *
 * - Monotributistas: la renta presunta es baja, por lo que la enorme mayoría
 *   termina cobrando el haber mínimo independientemente de su ingreso real.
 * - Autónomos: similar, pero las categorías medias/altas superan el mínimo;
 *   se aplica un premium conservador.
 * - Relación de dependencia: haber = PBU + PAP, con PAP = 1,5% × años × ingreso
 *   (Ley 24.241), acotado entre el haber mínimo y el máximo.
 */
function jubilacionEstatal(inputs: SimulatorInputs): number {
  switch (inputs.situacion) {
    case "monotributista":
      return JUBILACION_MINIMA;
    case "autonomo":
      return Math.round(JUBILACION_MINIMA * FACTOR_AUTONOMO);
    case "relacion_dependencia": {
      const pap = COEF_PAP * ANIOS_APORTES_REQUERIDOS * inputs.ingresoMensual; // 45% del ingreso
      const haber = PBU + pap;
      return Math.round(Math.min(Math.max(haber, JUBILACION_MINIMA), HABER_MAXIMO));
    }
  }
}

// ----------------------------------------------------------------------------
// Cálculo por escenario (en términos reales)
// ----------------------------------------------------------------------------

function calcularEscenario(
  inputs: SimulatorInputs,
  nombre: string,
  descripcion: string,
  retornoRealAnual: number,
  brechaMensual: number,
  expVida: number
): Escenario {
  const aniosAcumulacion = inputs.edadRetiro - inputs.edadActual;
  const mesesAcumulacion = aniosAcumulacion * 12;
  const mesesRetiro = Math.max(0, expVida - inputs.edadRetiro) * 12;

  // Tasa real mensual equivalente
  const rMensual = Math.pow(1 + retornoRealAnual, 1 / 12) - 1;

  // Capital necesario al momento del retiro = valor presente de una renta que
  // paga la brecha mensual durante los años de retiro (anualidad real).
  const capitalNecesario =
    rMensual > 0
      ? brechaMensual * ((1 - Math.pow(1 + rMensual, -mesesRetiro)) / rMensual)
      : brechaMensual * mesesRetiro;

  // Los ahorros actuales crecen en términos reales hasta el retiro.
  const ahorroActualProyectado = inputs.ahorroActual * Math.pow(1 + rMensual, mesesAcumulacion);

  // Capital que falta acumular con ahorro nuevo.
  const capitalFaltante = Math.max(0, capitalNecesario - ahorroActualProyectado);

  // Ahorro mensual necesario (fórmula PMT de valor futuro de una anualidad).
  const ahorroMensualNecesario =
    rMensual > 0 && mesesAcumulacion > 0
      ? (capitalFaltante * rMensual) / (Math.pow(1 + rMensual, mesesAcumulacion) - 1)
      : mesesAcumulacion > 0
        ? capitalFaltante / mesesAcumulacion
        : 0;

  // Proyección año a año del capital acumulado vs. la meta.
  const proyeccion: ProyeccionAnual[] = [];
  let acumulado = inputs.ahorroActual;
  for (let mes = 0; mes <= mesesAcumulacion; mes++) {
    if (mes % 12 === 0) {
      proyeccion.push({
        edad: inputs.edadActual + mes / 12,
        ahorroAcumulado: Math.round(acumulado),
        meta: Math.round(capitalNecesario),
      });
    }
    acumulado = acumulado * (1 + rMensual) + ahorroMensualNecesario;
  }

  return {
    nombre,
    descripcion,
    retornoRealAnual,
    capitalNecesario: Math.round(capitalNecesario),
    ahorroMensualNecesario: Math.round(ahorroMensualNecesario),
    proyeccion,
  };
}

// ----------------------------------------------------------------------------
// Cálculo principal
// ----------------------------------------------------------------------------

export function calcularSimulacion(inputs: SimulatorInputs): ResultadoSimulacion {
  const expVida = expectativaVida(inputs.sexo);
  const aniosHastaRetiro = inputs.edadRetiro - inputs.edadActual;
  const aniosEnRetiro = Math.max(0, expVida - inputs.edadRetiro);

  const jubilacionEstatalMensual = jubilacionEstatal(inputs);
  const tasaReemplazoEstatal = jubilacionEstatalMensual / inputs.ingresoMensual;

  const ingresoObjetivoRetiro = inputs.ingresoMensual * TASA_REEMPLAZO_OBJETIVO;
  const brechaMensual = Math.max(0, ingresoObjetivoRetiro - jubilacionEstatalMensual);

  // ¿Llega a los 30 años de aportes? Heurística informativa: asume aportes
  // continuos desde el inicio de la vida laboral a los 23. No condiciona el
  // cálculo del ahorro, solo alimenta una advertencia para el usuario.
  const aniosAportadosEstimados = inputs.edadRetiro - 23;
  const cumpleAniosAportes = aniosAportadosEstimados >= ANIOS_APORTES_REQUERIDOS;

  return {
    inputs,
    aniosHastaRetiro,
    aniosEnRetiro,
    expectativaVida: expVida,
    jubilacionEstatalMensual,
    tasaReemplazoEstatal,
    ingresoObjetivoRetiro,
    brechaMensual,
    cumpleAniosAportes,
    escenarios: {
      conservador: calcularEscenario(
        inputs,
        "Conservador",
        "Plazo fijo y bonos en pesos. Bajo riesgo, retorno apenas por encima de la inflación.",
        RETORNO_REAL.conservador,
        brechaMensual,
        expVida
      ),
      moderado: calcularEscenario(
        inputs,
        "Moderado",
        "Cartera mixta entre pesos y activos dolarizados. Equilibrio entre riesgo y retorno.",
        RETORNO_REAL.moderado,
        brechaMensual,
        expVida
      ),
      optimista: calcularEscenario(
        inputs,
        "Optimista",
        "Cartera dolarizada vía CEDEARs del S&P 500. Mayor retorno real esperado, mayor volatilidad.",
        RETORNO_REAL.optimista,
        brechaMensual,
        expVida
      ),
    },
  };
}

// ----------------------------------------------------------------------------
// Formateo
// ----------------------------------------------------------------------------

export function formatearPesos(valor: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatearPorcentaje(valor: number): string {
  return `${(valor * 100).toFixed(1)}%`;
}
