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

const URL_PATH = "/jubilacion-monotributista";
const TITULO = "¿Cuánto cobra de jubilación un monotributista en 2026?";
const DESCRIPCION =
  "Un monotributista cobra el haber mínimo: ~$403.318 por mes en 2026, gane lo que gane. Te explicamos por qué, los requisitos y cuánto necesitás ahorrar para cubrir la brecha.";

export const metadata = articleMetadata({ titulo: TITULO, descripcion: DESCRIPCION, urlPath: URL_PATH });

const FAQS = [
  {
    pregunta: "¿Cuánto cobra de jubilación un monotributista en 2026?",
    respuesta:
      "En 2026 un monotributista cobra el haber mínimo, alrededor de $403.318 por mes (más los bonos que disponga ANSES). La gran mayoría cobra ese mínimo sin importar la categoría ni lo que facture.",
  },
  {
    pregunta: "¿Un monotributista que factura más cobra más jubilación?",
    respuesta:
      "No. El sistema calcula el haber sobre una renta presunta muy baja, por lo que casi todos los monotributistas terminan en el haber mínimo. Facturar el doble no se traduce en una jubilación mayor.",
  },
  {
    pregunta: "¿Cuántos años de aportes necesito para jubilarme como monotributista?",
    respuesta:
      "Se exigen 30 años de aportes y la edad legal (65 años los hombres, 60 las mujeres). Si no llegás a los 30 años, podés acceder a la PUAM, que equivale al 80% del haber mínimo (unos $322.654).",
  },
  {
    pregunta: "¿A qué edad se jubila un monotributista?",
    respuesta:
      "A la misma edad que el resto del sistema: 65 años los hombres y 60 las mujeres, siempre que se cumplan los 30 años de aportes.",
  },
  {
    pregunta: "¿Cómo se actualiza la jubilación mínima?",
    respuesta:
      "Desde 2024 la movilidad es mensual y sigue la inflación (IPC) con dos meses de rezago. Por eso el monto nominal sube, pero su poder adquisitivo se mantiene más o menos estable.",
  },
  {
    pregunta: "¿Cómo puedo mejorar mi jubilación si soy monotributista?",
    respuesta:
      "Como el Estado solo te garantiza el mínimo, la diferencia hay que cubrirla con ahorro e inversión propios. Cuanto antes empieces, menos necesitás ahorrar por mes. Podés calcular tu brecha y tu ahorro mensual con el simulador gratuito de RetiroLibre.",
  },
];

const jsonLd = articleJsonLd({ titulo: TITULO, descripcion: DESCRIPCION, urlPath: URL_PATH, faqs: FAQS });

export default function JubilacionMonotributistaPage() {
  return (
    <ArticleShell jsonLd={jsonLd} eyebrow="Jubilación · Monotributo" titulo={TITULO}>
      <RespuestaCorta>
        <strong>Respuesta corta:</strong> en 2026 un monotributista cobra el{" "}
        <strong>haber mínimo, alrededor de $403.318 por mes</strong> (más los bonos que
        disponga ANSES), <strong>sin importar lo que facture</strong>. A diferencia de la
        relación de dependencia, facturar más no se traduce en una jubilación más alta.
      </RespuestaCorta>

      <Seccion titulo="Por qué casi todos los monotributistas cobran el mínimo">
        <p>
          La jubilación de un trabajador en relación de dependencia se calcula sobre sus
          sueldos reales. La del monotributista, en cambio, se calcula sobre una{" "}
          <strong>renta presunta</strong>: un valor fijo y bajo que asigna el sistema según la
          categoría, muy por debajo de lo que la mayoría factura en la práctica.
        </p>
        <p>
          El resultado es que, hagas la categoría que hagas, el haber que surge del cálculo
          casi siempre queda por debajo del piso legal. Y como nadie puede cobrar menos que el
          haber mínimo, <strong>terminás cobrando exactamente ese mínimo</strong>.
        </p>
      </Seccion>

      <Seccion titulo="Cuánto representa eso de tu ingreso actual (tasa de reemplazo)">
        <p>
          La <strong>tasa de reemplazo</strong> es qué porcentaje de tu ingreso de hoy te va a
          cubrir la jubilación. Para un monotributista, como el haber es fijo, cuanto más
          facturás, peor es la cobertura:
        </p>
        <Tabla
          columnas={["Si facturás por mes", "El Estado te da", "Tasa de reemplazo"]}
          filas={[
            ["$500.000", "$403.318", "81%"],
            ["$800.000", "$403.318", "50%"],
            ["$1.500.000", "$403.318", "27%"],
            ["$3.000.000", "$403.318", "13%"],
          ]}
        />
        <p className="text-sm text-gray-500">
          Para tener una jubilación cómoda se suele apuntar a una tasa de reemplazo del 70%. Un
          monotributista que factura $1.500.000 está cobrando apenas un 27%: hay una brecha
          enorme que tiene que cubrir por su cuenta.
        </p>
      </Seccion>

      <CTA
        titulo="¿Querés saber tu brecha exacta?"
        texto="El simulador calcula cuánto te daría el Estado según tu situación y cuánto necesitás ahorrar por mes para cubrir la diferencia. Gratis y en 2 minutos."
        boton="Calcular mi jubilación →"
      />

      <Seccion titulo="Requisitos para jubilarte como monotributista">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Edad:</strong> 65 años los hombres, 60 las mujeres.
          </li>
          <li>
            <strong>Aportes:</strong> 30 años de aportes al sistema. El pago mensual del
            monotributo ya incluye el componente jubilatorio.
          </li>
          <li>
            <strong>Si no llegás a los 30 años:</strong> podés acceder a la PUAM (Pensión
            Universal para el Adulto Mayor), que equivale al <strong>80% del haber mínimo</strong>{" "}
            (unos $322.654), a partir de los 65 años para ambos sexos.
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="Cómo se actualiza el haber mínimo">
        <p>
          Desde 2024 la movilidad es <strong>mensual y sigue la inflación (IPC)</strong> con
          dos meses de rezago. Eso significa que el monto en pesos sube todos los meses, pero su
          poder de compra se mantiene relativamente estable. Por eso, cuando planificás a 20 o
          30 años, lo que importa no es el número nominal sino{" "}
          <strong>cuánto vale en pesos de hoy</strong> — el enfoque que usa nuestro simulador.
        </p>
      </Seccion>

      <Seccion titulo="Qué podés hacer para mejorar tu jubilación">
        <p>
          Si el Estado solo te garantiza el mínimo, la única forma de no perder nivel de vida al
          jubilarte es <strong>construir tu propio capital de retiro</strong> con ahorro e
          inversión. La buena noticia: el tiempo juega a tu favor. Empezar a los 30 requiere
          ahorrar mucho menos por mes que empezar a los 45, gracias al interés compuesto.
        </p>
        <p>
          El primer paso es ponerle números a tu situación: cuánto te va a dar el Estado, qué
          brecha te queda y cuánto necesitás ahorrar por mes para cerrarla en distintos
          escenarios de inversión.
        </p>
      </Seccion>

      <FAQ faqs={FAQS} />

      <ArticulosRelacionados
        articulos={[
          { href: "/cuanto-ahorrar-para-jubilarse", titulo: "¿Cuánto necesito ahorrar para jubilarme en Argentina?" },
          { href: "/como-invertir-para-la-jubilacion", titulo: "Cómo invertir para el retiro en Argentina (guía 2026)" },
          { href: "/jubilacion-autonomos", titulo: "Jubilación de autónomos en 2026: cuánto se cobra y requisitos" },
        ]}
      />

      <p className="text-xs text-gray-400 mt-10 leading-relaxed">
        Los valores corresponden a estimaciones a junio de 2026 según parámetros del sistema
        previsional argentino (Ley 24.241, ANSES/INDEC). Este contenido es informativo y no
        constituye asesoramiento previsional ni financiero.
      </p>
    </ArticleShell>
  );
}
