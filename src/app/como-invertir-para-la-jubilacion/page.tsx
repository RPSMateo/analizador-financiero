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

const URL_PATH = "/como-invertir-para-la-jubilacion";
const TITULO = "Cómo invertir para el retiro en Argentina (guía 2026)";
const DESCRIPCION =
  "Qué instrumentos usar para construir tu jubilación en Argentina: plazo fijo UVA, bonos CER, obligaciones negociables en dólares y CEDEARs. Cómo armar una cartera según tu perfil.";

export const metadata = articleMetadata({ titulo: TITULO, descripcion: DESCRIPCION, urlPath: URL_PATH });

const FAQS = [
  {
    pregunta: "¿Dónde conviene invertir para la jubilación en Argentina?",
    respuesta:
      "Para el largo plazo conviene una cartera diversificada que combine instrumentos que ganen a la inflación (plazo fijo UVA, bonos CER), renta en dólares (obligaciones negociables) y crecimiento global (CEDEARs del S&P 500 y Nasdaq). La proporción depende de tu perfil de riesgo y tu horizonte.",
  },
  {
    pregunta: "¿Qué son los CEDEARs y por qué sirven para el retiro?",
    respuesta:
      "Los CEDEARs son certificados que representan acciones de empresas del exterior y se operan en pesos en la bolsa argentina. Permiten invertir en el S&P 500 o en tecnológicas globales sin abrir una cuenta afuera, y funcionan como cobertura frente al peso y la inflación.",
  },
  {
    pregunta: "¿Qué es un plazo fijo UVA?",
    respuesta:
      "Es un plazo fijo que ajusta el capital por inflación (índice UVA/CER) más una tasa. Su objetivo es preservar el poder adquisitivo en pesos, por eso es útil para la parte conservadora de una cartera de retiro.",
  },
  {
    pregunta: "¿Cuánto riesgo debería tomar según mi edad?",
    respuesta:
      "Mientras más lejos esté tu retiro, más podés tolerar la volatilidad de los activos de crecimiento (acciones, CEDEARs), porque tenés tiempo de recuperar caídas. A medida que te acercás a la jubilación, conviene migrar gradualmente hacia instrumentos más estables.",
  },
  {
    pregunta: "¿Necesito mucho dinero para empezar a invertir para el retiro?",
    respuesta:
      "No. Con una cuenta comitente gratuita podés empezar con montos chicos y aportar todos los meses. Lo importante es la constancia y empezar temprano: el interés compuesto hace el trabajo pesado con el tiempo.",
  },
];

const jsonLd = articleJsonLd({ titulo: TITULO, descripcion: DESCRIPCION, urlPath: URL_PATH, faqs: FAQS });

export default function ComoInvertirPage() {
  return (
    <ArticleShell jsonLd={jsonLd} eyebrow="Inversión · Largo plazo" titulo={TITULO}>
      <RespuestaCorta>
        <strong>Respuesta corta:</strong> para construir tu jubilación conviene una{" "}
        <strong>cartera diversificada</strong> que combine instrumentos que le ganen a la
        inflación (plazo fijo UVA, bonos CER), renta en dólares (obligaciones negociables) y
        crecimiento global (CEDEARs del S&amp;P 500 y Nasdaq). La proporción entre ellos depende
        de tu <strong>perfil de riesgo</strong> y de cuántos años te faltan para el retiro.
      </RespuestaCorta>

      <Seccion titulo="Por qué no alcanza con ahorrar en pesos (ni en el colchón)">
        <p>
          En Argentina, guardar pesos sin invertir equivale a perder poder de compra cada año.
          El objetivo de invertir para el retiro no es &ldquo;hacerse rico rápido&rdquo;, sino{" "}
          <strong>preservar y hacer crecer tu capital por encima de la inflación</strong> durante
          décadas. Para eso se usan instrumentos que apuntan a un <strong>retorno real</strong>{" "}
          positivo.
        </p>
      </Seccion>

      <Seccion titulo="Los instrumentos clave para el retiro en Argentina">
        <Tabla
          columnas={["Instrumento", "Para qué sirve", "Riesgo"]}
          filas={[
            ["Plazo fijo UVA / Bonos CER", "Ganarle a la inflación en pesos", "Bajo"],
            ["Obligaciones Negociables USD", "Renta y capital en dólares", "Medio"],
            ["CEDEARs del S&P 500", "Crecimiento global diversificado", "Medio"],
            ["CEDEARs tecnológicos (Nasdaq)", "Mayor crecimiento, más volátil", "Alto"],
            ["Oro (CEDEAR GLD)", "Diversificar y bajar volatilidad", "Medio"],
          ]}
        />
        <p>
          La idea no es elegir uno solo, sino <strong>combinarlos</strong>. Cada uno cumple un rol:
          los de inflación protegen, los de dólares estabilizan y los de crecimiento empujan el
          capital hacia arriba en el largo plazo.
        </p>
      </Seccion>

      <Seccion titulo="Cómo armar tu cartera según tu perfil">
        <p>
          Una forma simple de pensarlo es por <strong>perfil de riesgo</strong>, que en general
          se alinea con tu horizonte: cuanto más lejos esté tu retiro, más crecimiento podés
          tolerar.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Conservador:</strong> peso fuerte en plazo fijo UVA y obligaciones en
            dólares, una porción menor en CEDEARs del S&amp;P 500.
          </li>
          <li>
            <strong>Moderado:</strong> mitad en crecimiento (CEDEARs), mitad en instrumentos de
            inflación y dólares, con algo de oro para amortiguar.
          </li>
          <li>
            <strong>Optimista:</strong> mayor exposición a CEDEARs del S&amp;P 500 y Nasdaq, con
            una base de dólares y UVA.
          </li>
        </ul>
        <p>
          La versión Pro del simulador te arma esta cartera con{" "}
          <strong>montos concretos en pesos</strong>: cuánto poner en cada instrumento según tu
          ahorro mensual y tu perfil.
        </p>
      </Seccion>

      <CTA
        titulo="Convertí tu ahorro en un plan de inversión concreto"
        texto="El simulador calcula cuánto ahorrar por mes y, en la versión completa, en qué instrumentos repartirlo según tu perfil. De 'ahorrá X' a 'poné X acá, Y allá'."
        boton="Armar mi plan →"
      />

      <Seccion titulo="Tres principios que valen más que cualquier instrumento">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Empezá temprano:</strong> el interés compuesto necesita tiempo. Diez años de
            diferencia pueden duplicar el resultado final.
          </li>
          <li>
            <strong>Aportá de forma constante:</strong> invertir un monto fijo todos los meses
            promedia los precios y saca la emoción de la ecuación.
          </li>
          <li>
            <strong>Diversificá:</strong> no pongas todo en un solo activo ni en una sola moneda.
            La cartera equilibrada sobrevive a los vaivenes.
          </li>
        </ul>
      </Seccion>

      <FAQ faqs={FAQS} />

      <ArticulosRelacionados
        articulos={[
          { href: "/cuanto-ahorrar-para-jubilarse", titulo: "¿Cuánto necesito ahorrar para jubilarme en Argentina?" },
          { href: "/jubilacion-monotributista", titulo: "¿Cuánto cobra de jubilación un monotributista en 2026?" },
          { href: "/jubilacion-autonomos", titulo: "Jubilación de autónomos en 2026: cuánto se cobra y requisitos" },
        ]}
      />

      <p className="text-xs text-gray-400 mt-10 leading-relaxed">
        Este contenido es educativo e informativo y no constituye asesoramiento financiero. Las
        carteras mencionadas son ilustrativas: ajustá los instrumentos a tu situación y consultá
        a un profesional matriculado antes de invertir.
      </p>
    </ArticleShell>
  );
}
