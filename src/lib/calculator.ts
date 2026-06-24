export interface SimulatorInputs {
  edadActual: number;
  edadRetiro: number;
  ingresoMensual: number; // en ARS
  ahorroActual: number;   // en ARS
  categoriaMonotributo: "monotributista" | "autonomo" | "relacion_dependencia";
}

export interface Escenario {
  nombre: string;
  descripcion: string;
  tasaRetornoAnual: number;
  inflacionAnual: number;
  tasaRetornoReal: number;
  capitalNecesario: number;
  ahorroMensualNecesario: number;
  aporteEstadoMensual: number;
  brechaAnual: number;
  proyeccionAhorros: ProyeccionAnual[];
}

export interface ProyeccionAnual {
  edad: number;
  ahorroAcumulado: number;
  metaAcumulada: number;
}

export interface ResultadoSimulacion {
  inputs: SimulatorInputs;
  aniosHastaRetiro: number;
  tasaReemplazoPrevisionArgentina: number;
  escenarios: {
    conservador: Escenario;
    moderado: Escenario;
    optimista: Escenario;
  };
}

// Estimaciones del sistema previsional argentino según categoría
// Basadas en haberes mínimos y máximos del SIPA (valores aproximados como % del ingreso)
function tasaReemplazoEstado(categoria: SimulatorInputs["categoriaMonotributo"]): number {
  switch (categoria) {
    case "monotributista":
      // Monotributistas acceden a jubilación mínima independientemente del ingreso
      // Aprox. 30-40% del ingreso para ingresos bajos, mucho menos para ingresos altos
      return 0.30;
    case "autonomo":
      // Autónomos aportan sobre categoría, mejor cobertura que monotributo
      return 0.45;
    case "relacion_dependencia":
      // Sistema de reparto, mejor cobertura pero igual muy limitada
      return 0.55;
  }
}

function calcularEscenario(
  inputs: SimulatorInputs,
  nombre: string,
  descripcion: string,
  tasaRetornoAnual: number,
  inflacionAnual: number
): Escenario {
  const anios = inputs.edadRetiro - inputs.edadActual;
  const meses = anios * 12;

  // Tasa de retorno real (Fisher equation)
  const tasaRetornoReal = (1 + tasaRetornoAnual) / (1 + inflacionAnual) - 1;
  const tasaRealMensual = Math.pow(1 + tasaRetornoReal, 1 / 12) - 1;
  const tasaNominalMensual = Math.pow(1 + tasaRetornoAnual, 1 / 12) - 1;

  // Estimar jubilación estatal en pesos de hoy
  const tasaReemplazo = tasaReemplazoEstado(inputs.categoriaMonotributo);
  const aporteEstadoMensual = inputs.ingresoMensual * tasaReemplazo;

  // Ingreso objetivo en retiro = 70% del ingreso actual (en pesos de hoy)
  const ingresoObjetivoRetiro = inputs.ingresoMensual * 0.70;

  // Brecha que debe cubrir el ahorro privado (mensual, en pesos de hoy)
  const brechaAnual = Math.max(0, ingresoObjetivoRetiro - aporteEstadoMensual) * 12;

  // Capital necesario para cubrir la brecha durante 20 años de retiro (edad retiro a 85)
  // Usando fórmula de valor presente de anualidad en términos reales
  const aniosRetiro = 85 - inputs.edadRetiro;
  const capitalNecesario =
    tasaRealMensual > 0
      ? (brechaAnual / 12) * ((1 - Math.pow(1 + tasaRealMensual, -aniosRetiro * 12)) / tasaRealMensual)
      : (brechaAnual / 12) * aniosRetiro * 12;

  // Capital que ya tenemos acumulado proyectado a la fecha de retiro
  const ahorroActualProyectado = inputs.ahorroActual * Math.pow(1 + tasaNominalMensual, meses);

  // Capital adicional que necesitamos acumular
  const capitalFaltante = Math.max(0, capitalNecesario - ahorroActualProyectado);

  // Ahorro mensual necesario para llegar al capital faltante (fórmula PMT)
  const ahorroMensualNecesario =
    tasaNominalMensual > 0 && meses > 0
      ? capitalFaltante * tasaNominalMensual / (Math.pow(1 + tasaNominalMensual, meses) - 1)
      : meses > 0 ? capitalFaltante / meses : 0;

  // Proyección año a año para el gráfico
  const proyeccionAhorros: ProyeccionAnual[] = [];
  let acumulado = inputs.ahorroActual;
  for (let i = 0; i <= anios; i++) {
    const metaEnEseMomento = capitalNecesario / Math.pow(1 + tasaNominalMensual, (anios - i) * 12);
    proyeccionAhorros.push({
      edad: inputs.edadActual + i,
      ahorroAcumulado: Math.round(acumulado),
      metaAcumulada: Math.round(metaEnEseMomento),
    });
    acumulado = (acumulado + ahorroMensualNecesario * 12) * (1 + tasaRetornoAnual);
  }

  return {
    nombre,
    descripcion,
    tasaRetornoAnual,
    inflacionAnual,
    tasaRetornoReal,
    capitalNecesario: Math.round(capitalNecesario),
    ahorroMensualNecesario: Math.round(ahorroMensualNecesario),
    aporteEstadoMensual: Math.round(aporteEstadoMensual),
    brechaAnual: Math.round(brechaAnual),
    proyeccionAhorros,
  };
}

export function calcularSimulacion(inputs: SimulatorInputs): ResultadoSimulacion {
  const aniosHastaRetiro = inputs.edadRetiro - inputs.edadActual;

  return {
    inputs,
    aniosHastaRetiro,
    tasaReemplazoPrevisionArgentina: tasaReemplazoEstado(inputs.categoriaMonotributo),
    escenarios: {
      conservador: calcularEscenario(
        inputs,
        "Conservador",
        "Inversión en plazos fijos y bonos. Retorno moderado, menor riesgo.",
        0.70, // 70% nominal anual — referencia tasas argentinas conservadoras
        0.60  // 60% inflación anual — escenario inflacionario
      ),
      moderado: calcularEscenario(
        inputs,
        "Moderado",
        "Mix de renta fija y CEDEARs. Equilibrio entre riesgo y retorno.",
        0.90,
        0.55
      ),
      optimista: calcularEscenario(
        inputs,
        "Optimista",
        "Cartera dolarizada y CEDEARs. Mayor retorno real, mayor riesgo.",
        1.10,
        0.50
      ),
    },
  };
}

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
