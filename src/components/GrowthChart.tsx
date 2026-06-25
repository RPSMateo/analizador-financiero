import { ProyeccionAnual, formatearPesos, formatearPesosCompacto } from "@/lib/calculator";

/**
 * Gráfico de área (SVG puro, sin dependencias) que muestra cómo crece tu
 * capital acumulado año a año hasta alcanzar la meta de retiro.
 *
 * - Curva/área: capital acumulado.
 * - Línea punteada horizontal: meta de capital a alcanzar.
 * - Eje X: edad. Eje Y: monto (compacto).
 */

interface GrowthChartProps {
  proyeccion: ProyeccionAnual[];
  /** Color base (tailwind emerald-500 por defecto). */
  color?: string;
}

// Geometría del lienzo (coordenadas internas del viewBox).
const W = 640;
const H = 260;
const PAD = { top: 16, right: 16, bottom: 28, left: 56 };

export default function GrowthChart({ proyeccion, color = "#10b981" }: GrowthChartProps) {
  if (proyeccion.length < 2) return null;

  const meta = proyeccion[0].meta;
  const maxValor = Math.max(meta, ...proyeccion.map((p) => p.ahorroAcumulado));
  const yMax = maxValor * 1.08 || 1;

  const edadMin = proyeccion[0].edad;
  const edadMax = proyeccion[proyeccion.length - 1].edad;
  const rangoEdad = Math.max(1, edadMax - edadMin);

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const x = (edad: number) => PAD.left + ((edad - edadMin) / rangoEdad) * innerW;
  const y = (valor: number) => PAD.top + innerH - (valor / yMax) * innerH;

  const puntos = proyeccion.map((p) => ({ x: x(p.edad), y: y(p.ahorroAcumulado), dato: p }));

  const lineaPath = puntos.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath =
    `M${puntos[0].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} ` +
    puntos.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") +
    ` L${puntos[puntos.length - 1].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`;

  const yMeta = y(meta);

  // Marcas del eje Y (0, mitad, máximo redondeado) y del eje X (inicio, medio, fin).
  const ticksY = [0, yMax / 2, yMax];
  const ticksX = [
    proyeccion[0],
    proyeccion[Math.floor(proyeccion.length / 2)],
    proyeccion[proyeccion.length - 1],
  ];

  const ultimo = proyeccion[proyeccion.length - 1];
  const alcanzaMeta = ultimo.ahorroAcumulado >= meta * 0.999;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Crecimiento del capital acumulado">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grilla horizontal + labels eje Y */}
        {ticksY.map((t, i) => (
          <g key={i}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#f1f5f9" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="fill-gray-400" fontSize={11}>
              {formatearPesosCompacto(t)}
            </text>
          </g>
        ))}

        {/* Línea de meta */}
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={yMeta}
          y2={yMeta}
          stroke="#f59e0b"
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <text x={W - PAD.right} y={yMeta - 6} textAnchor="end" className="fill-amber-500" fontSize={11} fontWeight={600}>
          Meta: {formatearPesosCompacto(meta)}
        </text>

        {/* Área + línea de capital */}
        <path d={areaPath} fill="url(#areaFill)" />
        <path d={lineaPath} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />

        {/* Punto final */}
        <circle cx={puntos[puntos.length - 1].x} cy={puntos[puntos.length - 1].y} r={4} fill={color} />

        {/* Labels eje X */}
        {ticksX.map((p, i) => (
          <text
            key={i}
            x={x(p.edad)}
            y={H - 8}
            textAnchor={i === 0 ? "start" : i === ticksX.length - 1 ? "end" : "middle"}
            className="fill-gray-400"
            fontSize={11}
          >
            {p.edad} años
          </text>
        ))}
      </svg>

      <p className="text-xs text-gray-500 mt-1 text-center">
        Al retirarte acumularías{" "}
        <span className="font-semibold text-gray-700">{formatearPesos(ultimo.ahorroAcumulado)}</span>{" "}
        {alcanzaMeta ? (
          <span className="text-emerald-600">— cubrís la meta ✓</span>
        ) : (
          <span className="text-amber-600">— aún por debajo de la meta</span>
        )}
      </p>
    </div>
  );
}
