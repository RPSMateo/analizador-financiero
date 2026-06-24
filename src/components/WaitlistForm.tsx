"use client";

import { useState } from "react";

type Estado = "idle" | "loading" | "success" | "error";

interface WaitlistFormProps {
  /** Identifica desde dónde se envió (ej: "landing", "simulador"). */
  origen?: string;
  /** Plan de interés (ej: "pro"). */
  plan?: string;
  /** Situación laboral, si está disponible desde el simulador. */
  situacion?: string;
  /** Texto del botón. */
  textoBoton?: string;
  /** Variante de color: claro (sobre fondo oscuro) u oscuro (sobre fondo claro). */
  variante?: "claro" | "oscuro";
}

export default function WaitlistForm({
  origen = "landing",
  plan = "pro",
  situacion,
  textoBoton = "Quiero acceso anticipado",
  variante = "oscuro",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensaje, setMensaje] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEstado("loading");
    setMensaje("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, origen, plan, situacion }),
      });
      const data = await res.json();

      if (!res.ok) {
        setEstado("error");
        setMensaje(data.error ?? "Algo salió mal. Probá de nuevo.");
        return;
      }

      setEstado("success");
      setMensaje(
        data.alreadyRegistered
          ? "¡Ya estabas en la lista! Te avisamos apenas lancemos."
          : "¡Listo! Te avisamos apenas abramos el acceso."
      );
      setEmail("");
    } catch {
      setEstado("error");
      setMensaje("No pudimos conectar. Revisá tu conexión e intentá de nuevo.");
    }
  }

  if (estado === "success") {
    return (
      <div
        className={`rounded-xl p-4 text-center text-sm font-medium ${
          variante === "claro"
            ? "bg-white/10 text-white"
            : "bg-emerald-50 text-emerald-700"
        }`}
      >
        ✅ {mensaje}
      </div>
    );
  }

  const inputClass =
    variante === "claro"
      ? "bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-white/40"
      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-emerald-500";

  const botonClass =
    variante === "claro"
      ? "bg-white text-emerald-700 hover:bg-emerald-50"
      : "bg-emerald-600 text-white hover:bg-emerald-700";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          disabled={estado === "loading"}
          className={`flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 disabled:opacity-60 ${inputClass}`}
        />
        <button
          type="submit"
          disabled={estado === "loading"}
          className={`font-semibold px-5 py-3 rounded-xl text-sm whitespace-nowrap transition-colors disabled:opacity-60 ${botonClass}`}
        >
          {estado === "loading" ? "Enviando..." : textoBoton}
        </button>
      </div>
      {estado === "error" && (
        <p className={`text-xs mt-2 ${variante === "claro" ? "text-red-200" : "text-red-500"}`}>
          {mensaje}
        </p>
      )}
    </form>
  );
}
