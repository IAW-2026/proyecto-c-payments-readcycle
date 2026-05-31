"use client";

import { useRouter } from "next/dist/client/components/navigation";
import { useState } from "react";

export default function CreateDisputePage() {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "/api/payments/disputes/new",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            transactionId,
            reason,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error creating dispute");
        return;
      }

      alert("Disputa creada correctamente");

      setTransactionId("");
      setReason("");

    } catch (error) {
      console.error(error);

      alert("Unexpected error");

    } finally {
      setLoading(false);
    }
    router.push("/dashboard");
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-brand-beige flex flex-col justify-start p-6 sm:p-8 relative overflow-hidden font-sans">
      {/* Glows de fondo difusos para profundidad */}
      <div className="absolute top-[-10%] right-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-sage/5 blur-[100px] sm:blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-clay/5 blur-[100px] sm:blur-[120px] pointer-events-none select-none z-0" />

      <div className="mx-auto w-full max-w-2xl z-10">
        <div className="mb-8">
          <p className="mb-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-clay">
            Procedimiento Legal
          </p>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-forest tracking-tight">
            Crear Disputa
          </h1>

          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-500 max-w-2xl">
            Complete los detalles a continuación para iniciar un proceso de
            reclamación sobre una transacción específica.
          </p>
        </div>

        <div className="rounded-2xl border border-brand-sand/40 bg-white p-8 shadow-sm transition-all hover:shadow-md duration-300">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm sm:text-base font-bold text-brand-forest">
                Transacción
              </label>

              <input
                type="text"
                placeholder="Ingrese el ID de la transacción"
                value={transactionId}
                onChange={(e) =>
                  setTransactionId(e.target.value)
                }
                required
                className="w-full rounded-xl border border-brand-sand/40 bg-white px-4 py-3 text-sm text-brand-forest font-semibold outline-none transition-all focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm sm:text-base font-bold text-brand-forest">
                  Motivo de la Disputa
                </label>

                <span className="text-xs text-zinc-500 font-semibold">
                  {reason.length} / 500
                </span>
              </div>

              <textarea
                placeholder="Describa detalladamente el problema con esta transacción..."
                maxLength={500}
                rows={6}
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                required
                className="w-full resize-none rounded-xl border border-brand-sand/40 bg-white px-4 py-3 text-sm text-brand-forest font-semibold outline-none transition-all focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Sea lo más específico posible para acelerar la resolución.
              </p>
            </div>

            <div className="border-t border-brand-sand/30" />

            <div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-brand-clay text-brand-beige px-8 py-3.5 text-sm font-bold shadow-md transition-all duration-300 hover:bg-brand-clay/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer disabled:opacity-50 select-none"
              >
                {loading
                  ? "Enviando..."
                  : "Enviar Disputa"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}