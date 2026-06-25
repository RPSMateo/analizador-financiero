import { NextRequest } from "next/server";

const MP_API = "https://api.mercadopago.com/checkout/preferences";
const PRECIO_ARS = 9990;

export async function POST(request: NextRequest) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return Response.json({ error: "Pagos no configurados" }, { status: 503 });
  }

  // Determina la URL base del entorno (local vs. producción)
  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://retirolibre.vercel.app";

  const preference = {
    items: [
      {
        id: "retirolibre-pro",
        title: "RetiroLibre Pro — Plan de retiro completo",
        quantity: 1,
        unit_price: PRECIO_ARS,
        currency_id: "ARS",
      },
    ],
    back_urls: {
      success: `${origin}/simulador?pago=ok`,
      failure: `${origin}/simulador?pago=error`,
      pending: `${origin}/simulador?pago=pendiente`,
    },
    auto_return: "approved",
    external_reference: "pro-unlock",
    // Evita que MP sugiera cuotas para un monto chico de una sola vez
    payment_methods: {
      installments: 1,
    },
  };

  const res = await fetch(MP_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preference),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Mercado Pago error:", res.status, detail);
    // Devolvemos el mensaje de MP para poder diagnosticar (credenciales, back_urls, etc.)
    let mensaje = "Error al crear el pago en Mercado Pago.";
    try {
      const json = JSON.parse(detail);
      if (json.message) mensaje = `Mercado Pago: ${json.message}`;
    } catch {
      /* detail no era JSON */
    }
    return Response.json({ error: mensaje }, { status: 502 });
  }

  const data = await res.json();
  // init_point → checkout completo; sandbox_init_point → sandbox de pruebas
  return Response.json({ init_point: data.init_point as string });
}
