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

const URL_PATH = "/cuanto-ahorrar-para-jubilarse";
const TITULO = "¿Cuánto necesito ahorrar para jubilarme en Argentina?";
const DESCRIPCION =
  "Cuánto tenés que ahorrar por mes para jubilarte sin perder nivel de vida en Argentina. La regla general, ejemplos según edad y por qué empezar antes te ahorra la mitad.";

export const metadata = articleMetadata({ titulo: TITULO, descripcion: DESCRIPCION, urlPath: URL_PATH });

const FAQS = [
  {
    pregunta: "¿Cuánto necesito ahorrar por mes para jubilarme en Argentina?",
    respuesta:
      "Depende de tu edad, tu ingreso y cuánto te dará el Estado, pero una regla práctica es destinar entre el 10% y el 20% de tus ingresos a un fondo de retiro invertido. Cuanto más tarde empieces, mayor es el porcentaje necesario. La forma precisa de saberlo es calcular tu brecha previsional.",
  },
  {
    pregunta: "¿Cuánto capital necesito para retirarme?",
    respuesta:
      "Una referencia habitual es la regla del 4%: necesitás acumular unas 25 veces tu gasto anual deseado. Si querés cubrir $1.000.000 por mes ($12.000.000 al año), apuntás a un capital cercano a $300.000.000 en pesos de hoy, ajustado por lo que ya te cubre el Estado.",
  },
  {
    pregunta: "¿Es mejor empezar a ahorrar joven aunque sea poco?",
    respuesta:
      "Sí. Por el interés compuesto, empezar a los 25 puede requerir menos de la mitad del ahorro mensual que empezar a los 40 para llegar a la misma meta. El tiempo es la variable más poderosa, más que el monto.",
  },
  {
    pregunta: "¿Cómo afecta la inflación a lo que tengo que ahorrar?",
    respuesta:
      "En Argentina conviene razonar en pesos de hoy (poder adquisitivo constante) y usar tasas de retorno reales, por encima de la inflación. Ahorrar en pesos sin invertir hace que el capital pierda valor; por eso la estrategia de inversión es tan importante como el monto.",
  },
  {
    pregunta: "¿Cuánto me va a dar el Estado cuando me jubile?",
    respuesta:
      "Si sos monotributista o autónomo, lo más probable es que cobres cerca del haber mínimo (~$403.318 en 2026), gane lo que gane. Esa es la base sobre la que se calcula la brecha que tenés que cubrir vos mismo.",
  },
];

const jsonLd = articleJsonLd({ titulo: TITULO, descripcion: DESCRIPCION, urlPath: URL_PATH, faqs: FAQS });

export default function CuantoAhorrarPage() {
  return (
    <ArticleShell jsonLd={jsonLd} eyebrow="Planificación · Ahorro" titulo={TITULO}>
      <RespuestaCorta>
        <strong>Respuesta corta:</strong> no hay un número único, pero una guía práctica es
        destinar <strong>entre el 10% y el 20% de tus ingresos</strong> a un fondo de retiro
        invertido. El monto exacto depende de tu edad, tu ingreso y de cuánto te cubra el
        Estado —que para monotributistas y autónomos suele ser solo el haber mínimo—. Cuanto
        antes empieces, <strong>menos necesitás ahorrar por mes</strong>.
      </RespuestaCorta>

      <Seccion titulo="El punto de partida: tu brecha previsional">
        <p>
          Antes de hablar de cuánto ahorrar, hay que saber cuánto te falta. Esa diferencia se
          llama <strong>brecha previsional</strong>: lo que querés cobrar al jubilarte menos lo
          que te va a dar el Estado.
        </p>
        <p>
          La mayoría de los planificadores apunta a una <strong>tasa de reemplazo del 70%</strong>:
          cobrar al jubilarte alrededor del 70% de tu ingreso actual para no resignar nivel de
          vida. Si hoy ganás $1.000.000 por mes, tu objetivo sería ~$700.000. Si el Estado solo
          te da $403.318, tu brecha es de casi <strong>$300.000 por mes</strong> que tenés que
          financiar con capital propio.
        </p>
      </Seccion>

      <Seccion titulo="La regla del 4%: cuánto capital necesitás">
        <p>
          Para traducir esa brecha mensual en un capital objetivo, se usa la{" "}
          <strong>regla del 4%</strong>: podés retirar de forma sostenible cerca del 4% anual de
          una cartera invertida sin agotarla. Dicho al revés, necesitás acumular{" "}
          <strong>unas 25 veces el gasto anual</strong> que querés cubrir.
        </p>
        <p>
          Para una brecha de $300.000 por mes ($3.600.000 al año), el capital objetivo ronda los{" "}
          <strong>$90.000.000 en pesos de hoy</strong>. Parece mucho, pero se construye de a poco
          y con el interés compuesto a favor.
        </p>
      </Seccion>

      <Seccion titulo="Cuánto ahorrar por mes según cuándo empieces">
        <p>
          Acá está la clave que casi nadie aprovecha: el momento en que arrancás importa más que
          el monto. Para llegar a un mismo capital, el ahorro mensual necesario se dispara con
          cada año que postergás:
        </p>
        <Tabla
          columnas={["Edad a la que empezás", "Años hasta los 65", "Esfuerzo relativo de ahorro"]}
          filas={[
            ["25 años", "40 años", "1× (base)"],
            ["35 años", "30 años", "~2×"],
            ["45 años", "20 años", "~4×"],
            ["55 años", "10 años", "~10×"],
          ]}
        />
        <p className="text-sm text-gray-500">
          Valores ilustrativos asumiendo un retorno real anual constante. La conclusión es clara:
          empezar diez años antes puede significar ahorrar la mitad por mes para el mismo
          resultado.
        </p>
      </Seccion>

      <CTA
        titulo="Calculá tu número exacto en 2 minutos"
        texto="En vez de reglas generales, el simulador usa tu edad, tu ingreso y tu situación para decirte cuánto necesitás ahorrar por mes en 3 escenarios de inversión. Gratis."
        boton="Calcular cuánto ahorrar →"
      />

      <Seccion titulo="Por qué en Argentina hay que pensar en pesos de hoy">
        <p>
          Con inflación alta, un número futuro grande puede valer poco. Por eso conviene razonar
          en <strong>pesos de hoy</strong> y usar <strong>tasas de retorno reales</strong> (por
          encima de la inflación). Ahorrar pesos en una caja de ahorro es perder poder de compra
          año a año; la estrategia de inversión es tan importante como cuánto guardás.
        </p>
        <p>
          Instrumentos como los plazos fijos UVA, los bonos CER, las obligaciones negociables en
          dólares o los CEDEARs permiten buscar ese retorno real.{" "}
          <a href="/como-invertir-para-la-jubilacion">
            Lo vemos en detalle en esta guía de inversión para el retiro
          </a>
          .
        </p>
      </Seccion>

      <FAQ faqs={FAQS} />

      <ArticulosRelacionados
        articulos={[
          { href: "/como-invertir-para-la-jubilacion", titulo: "Cómo invertir para el retiro en Argentina (guía 2026)" },
          { href: "/jubilacion-monotributista", titulo: "¿Cuánto cobra de jubilación un monotributista en 2026?" },
          { href: "/jubilacion-autonomos", titulo: "Jubilación de autónomos en 2026: cuánto se cobra y requisitos" },
        ]}
      />

      <p className="text-xs text-gray-400 mt-10 leading-relaxed">
        Las cifras son ilustrativas y a valores de junio de 2026. Este contenido es informativo
        y no constituye asesoramiento financiero ni previsional.
      </p>
    </ArticleShell>
  );
}
