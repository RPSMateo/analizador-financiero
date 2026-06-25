import {
  articleMetadata,
  articleJsonLd,
  ArticleShell,
  RespuestaCorta,
  Seccion,
  CTA,
  FAQ,
  Tabla,
  ArticulosRelacionados,
} from "@/components/article";

const URL_PATH = "/jubilacion-autonomos";
const TITULO = "Jubilación de autónomos en 2026: cuánto se cobra y requisitos";
const DESCRIPCION =
  "Cómo se calcula la jubilación de un trabajador autónomo en Argentina, en qué se diferencia del monotributo, los requisitos de edad y aportes, y cuánto necesitás ahorrar para complementarla.";

export const metadata = articleMetadata({ titulo: TITULO, descripcion: DESCRIPCION, urlPath: URL_PATH });

const FAQS = [
  {
    pregunta: "¿Cuánto cobra de jubilación un autónomo en 2026?",
    respuesta:
      "Depende de las categorías en las que aportó y por cuántos años. A diferencia del monotributista, un autónomo que aportó en categorías altas durante muchos años puede superar el haber mínimo (~$403.318 en 2026), aunque muchos terminan cerca de ese piso.",
  },
  {
    pregunta: "¿En qué se diferencia la jubilación de autónomo y la de monotributista?",
    respuesta:
      "El monotributista casi siempre cobra el haber mínimo porque su aporte se calcula sobre una renta presunta baja. El autónomo aporta sobre categorías (I a V) con montos más altos, por lo que su haber puede ser mayor si sostuvo categorías elevadas en el tiempo.",
  },
  {
    pregunta: "¿Qué requisitos necesito para jubilarme como autónomo?",
    respuesta:
      "Los mismos que el régimen general: 65 años los hombres y 60 las mujeres, con 30 años de aportes efectivos al sistema. Si no llegás a los 30 años, podés acceder a la PUAM (80% del haber mínimo).",
  },
  {
    pregunta: "¿Cómo se calcula el haber de un autónomo?",
    respuesta:
      "Con tres componentes: la PBU (Prestación Básica Universal, un monto fijo), la PC (Prestación Compensatoria) y la PAP, que dependen de los años aportados y de las categorías sobre las que aportaste. Cuantos más años y más altas las categorías, mayor el haber.",
  },
  {
    pregunta: "¿Conviene aportar en una categoría más alta?",
    respuesta:
      "Aportar en categorías más altas puede mejorar el haber futuro, pero el impacto suele ser moderado frente al costo. Para la mayoría, complementar con ahorro e inversión propios rinde más que subir de categoría. Conviene hacer números en tu caso puntual.",
  },
];

const jsonLd = articleJsonLd({ titulo: TITULO, descripcion: DESCRIPCION, urlPath: URL_PATH, faqs: FAQS });

export default function JubilacionAutonomosPage() {
  return (
    <ArticleShell jsonLd={jsonLd} eyebrow="Jubilación · Autónomos" titulo={TITULO}>
      <RespuestaCorta>
        <strong>Respuesta corta:</strong> la jubilación de un autónomo depende de{" "}
        <strong>en qué categorías aportó y por cuántos años</strong>. A diferencia del
        monotributista —que casi siempre cobra el haber mínimo—, un autónomo que sostuvo
        categorías altas <strong>puede superar el mínimo</strong> (~$403.318 en 2026). Aun así,
        muchos terminan cerca de ese piso y necesitan complementar con ahorro propio.
      </RespuestaCorta>

      <Seccion titulo="Cómo se calcula el haber de un autónomo">
        <p>
          A diferencia del monotributo, el autónomo aporta al SIPA sobre{" "}
          <strong>categorías (I a V)</strong> definidas según su actividad e ingresos. El haber
          jubilatorio surge de tres componentes:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>PBU</strong> (Prestación Básica Universal): un monto fijo para todos los que
            cumplen los requisitos.
          </li>
          <li>
            <strong>PC</strong> (Prestación Compensatoria): reconoce los años aportados antes de
            2008.
          </li>
          <li>
            <strong>PAP</strong> (Prestación Adicional por Permanencia): reconoce los aportes
            desde 2008 en adelante.
          </li>
        </ul>
        <p>
          La PC y la PAP dependen de <strong>cuántos años aportaste y en qué categorías</strong>.
          Por eso dos autónomos con la misma edad pueden cobrar haberes distintos.
        </p>
      </Seccion>

      <Seccion titulo="Autónomo vs. monotributista: la diferencia clave">
        <Tabla
          columnas={["Aspecto", "Monotributista", "Autónomo"]}
          filas={[
            ["Base de aporte", "Renta presunta baja", "Categorías I a V"],
            ["Haber típico", "Haber mínimo", "Mínimo o más"],
            ["Puede superar el mínimo", "Casi nunca", "Sí, si aportó alto"],
            ["Edad de retiro", "65 H / 60 M", "65 H / 60 M"],
            ["Años de aportes", "30 años", "30 años"],
          ]}
        />
        <p>
          La conclusión: el autónomo tiene <strong>algo más de margen</strong> que el
          monotributista, pero sigue siendo muy probable que el Estado no le cubra el nivel de
          vida que tiene hoy.
        </p>
      </Seccion>

      <CTA
        titulo="¿Cuánto te va a dar el Estado a vos?"
        texto="El simulador estima tu haber según tu situación de autónomo y te dice cuánto necesitás ahorrar por mes para cubrir la brecha. Gratis y en 2 minutos."
        boton="Calcular mi jubilación →"
      />

      <Seccion titulo="Requisitos para jubilarte como autónomo">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Edad:</strong> 65 años los hombres, 60 las mujeres.
          </li>
          <li>
            <strong>Aportes:</strong> 30 años de aportes efectivos al sistema como autónomo.
          </li>
          <li>
            <strong>Si no llegás a los 30 años:</strong> podés acceder a la PUAM, que equivale al{" "}
            <strong>80% del haber mínimo</strong>, a partir de los 65 años para ambos sexos.
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="Cómo complementar tu jubilación de autónomo">
        <p>
          Incluso aportando en categorías altas, lo más prudente es no depender únicamente del
          Estado. Construir un <strong>capital de retiro propio</strong> con ahorro e inversión
          te da independencia del sistema previsional y de sus cambios.
        </p>
        <p>
          El primer paso es ponerle números: cuánto te dará el Estado, qué brecha te queda y
          cuánto ahorrar por mes para cerrarla.{" "}
          <a href="/cuanto-ahorrar-para-jubilarse">Acá explicamos cuánto necesitás ahorrar</a> y{" "}
          <a href="/como-invertir-para-la-jubilacion">cómo invertir ese ahorro</a>.
        </p>
      </Seccion>

      <FAQ faqs={FAQS} />

      <ArticulosRelacionados
        articulos={[
          { href: "/jubilacion-monotributista", titulo: "¿Cuánto cobra de jubilación un monotributista en 2026?" },
          { href: "/cuanto-ahorrar-para-jubilarse", titulo: "¿Cuánto necesito ahorrar para jubilarme en Argentina?" },
          { href: "/como-invertir-para-la-jubilacion", titulo: "Cómo invertir para el retiro en Argentina (guía 2026)" },
        ]}
      />

      <p className="text-xs text-gray-400 mt-10 leading-relaxed">
        Los valores corresponden a estimaciones a junio de 2026 según parámetros del sistema
        previsional argentino (Ley 24.241, ANSES). Este contenido es informativo y no constituye
        asesoramiento previsional ni financiero.
      </p>
    </ArticleShell>
  );
}
