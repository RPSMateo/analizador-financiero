/**
 * Carteras sugeridas por escenario — "plan de acción" del plan Pro.
 *
 * Traduce cada escenario de riesgo en una asignación concreta entre
 * instrumentos accesibles para un inversor minorista argentino. El objetivo
 * es pasar de "ahorrá $X por mes" a "poné $X en esto, $Y en aquello".
 *
 * IMPORTANTE: es contenido educativo/informativo, NO asesoramiento financiero.
 * Las asignaciones son ilustrativas y deben ajustarse al perfil de cada persona.
 */

export type EscenarioKey = "conservador" | "moderado" | "optimista";

export interface Instrumento {
  nombre: string;
  descripcion: string;
}

export interface AsignacionCartera {
  instrumento: Instrumento;
  /** Porcentaje de la cartera (0-100). */
  porcentaje: number;
}

const PLAZO_FIJO_UVA: Instrumento = {
  nombre: "Plazo fijo UVA / Bonos CER",
  descripcion: "Ajustan por inflación. Protegen el poder de compra con bajo riesgo en pesos.",
};

const ON_DOLAR: Instrumento = {
  nombre: "Obligaciones Negociables en USD",
  descripcion: "Deuda de empresas argentinas sólidas, con renta y capital en dólares.",
};

const CEDEAR_SP500: Instrumento = {
  nombre: "CEDEARs del S&P 500",
  descripcion: "Las 500 mayores empresas de EE.UU. en un solo activo, operado en pesos.",
};

const CEDEAR_NASDAQ: Instrumento = {
  nombre: "CEDEARs tecnológicos (Nasdaq)",
  descripcion: "Mayor crecimiento esperado y mayor volatilidad. Empresas tech globales.",
};

const ORO: Instrumento = {
  nombre: "Oro / diversificadores (CEDEAR GLD)",
  descripcion: "Reserva de valor que suele moverse distinto a las acciones. Reduce la volatilidad.",
};

export const CARTERAS: Record<EscenarioKey, AsignacionCartera[]> = {
  conservador: [
    { instrumento: PLAZO_FIJO_UVA, porcentaje: 50 },
    { instrumento: ON_DOLAR, porcentaje: 30 },
    { instrumento: CEDEAR_SP500, porcentaje: 20 },
  ],
  moderado: [
    { instrumento: CEDEAR_SP500, porcentaje: 40 },
    { instrumento: PLAZO_FIJO_UVA, porcentaje: 30 },
    { instrumento: ON_DOLAR, porcentaje: 20 },
    { instrumento: ORO, porcentaje: 10 },
  ],
  optimista: [
    { instrumento: CEDEAR_SP500, porcentaje: 45 },
    { instrumento: CEDEAR_NASDAQ, porcentaje: 25 },
    { instrumento: ON_DOLAR, porcentaje: 20 },
    { instrumento: PLAZO_FIJO_UVA, porcentaje: 10 },
  ],
};

/** Paleta para las barras de asignación (hasta 4 instrumentos). */
export const COLORES_CARTERA = ["#059669", "#0ea5e9", "#f59e0b", "#a855f7"];
