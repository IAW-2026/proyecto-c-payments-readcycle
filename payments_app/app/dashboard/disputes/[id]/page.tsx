"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface Dispute {
  id: string;
  createdAt: string;
  transaction: {
    orderId: string;
    amount: number;
    status: string;
  };
  status: string;
  reason: string;
  resolution: string | null;
}

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorCard from "@/components/ui/ErrorCard";

export default function DisputePage() {
  const params = useParams();
  const id = params?.id as string;
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  const [newStatus, setNewStatus] = useState<string>("");
  const [newResolution, setNewResolution] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isAdmin = clerkLoaded && Array.isArray(clerkUser?.publicMetadata?.roles)
    ? (clerkUser.publicMetadata.roles as string[]).includes("ADMIN")
    : false;

  useEffect(() => {
    if (!id) return;

    async function fetchDispute() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/payments/disputes/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch dispute");
        }
        const data = await res.json();
        setDispute(data);

        setNewStatus(data.status);
        setNewResolution(data.resolution || "");
      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch dispute";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchDispute();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;

    try {
      setIsSaving(true);
      setSaveSuccess(false);

      const res = await fetch(`/api/payments/disputes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          resolution: newResolution || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update dispute");
      }

      const updatedDispute = await res.json();
      setDispute(updatedDispute);
      setSaveSuccess(true);

      // Timer para la notificacion???
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando detalles de la disputa..." />;
  }

  if (error || !dispute) {
    return (
      <ErrorCard
        title="Error"
        message={error || "No se encontró la disputa"}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-brand-beige flex flex-col justify-start p-6 sm:p-8 relative overflow-hidden font-sans">
      {/* Glows de fondo difusos para profundidad */}
      <div className="absolute top-[-10%] right-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-sage/5 blur-[100px] sm:blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-clay/5 blur-[100px] sm:blur-[120px] pointer-events-none select-none z-0" />

      <div className="mx-auto w-full max-w-2xl z-10">
        <div className="w-full rounded-2xl border border-brand-sand/40 bg-white p-8 shadow-sm transition-all hover:shadow-md duration-300">
          <h2 className="mb-8 text-2xl font-bold text-brand-forest">
            Detalles de disputa {dispute.id}
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-500 text-sm sm:text-base">
                Fecha
              </span>
              <span className="font-bold text-brand-forest text-sm sm:text-base">
                {new Date(dispute.createdAt).toLocaleDateString("es-AR")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-500 text-sm sm:text-base">
                ID de Transaccion
              </span>
              <span className="font-bold text-brand-forest text-sm sm:text-base">
                {dispute.transaction.orderId}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-500 text-sm sm:text-base">
                Costo de transaccion
              </span>
              <span className="font-bold text-brand-forest text-sm sm:text-base">
                ${dispute.transaction.amount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-500 text-sm sm:text-base">
                Estado
              </span>
              <span className="rounded-lg bg-brand-sand/30 px-3 py-1 text-xs sm:text-sm font-semibold text-brand-forest">
                {dispute.status}
              </span>
            </div>
          </div>

          <div className="my-8 border-t border-brand-sand/30" />

          <div className="rounded-xl bg-brand-beige/40 border border-brand-sand/20 p-5">
            <h3 className="mb-4 text-xs sm:text-sm font-bold uppercase tracking-wide text-zinc-500">
              Motivo
            </h3>
            <div className="my-3 border-t border-brand-sand/20" />
            <span className="font-semibold text-brand-forest">
              {dispute.reason}
            </span>
          </div>

          <div className="mt-6 rounded-xl bg-brand-beige/40 border border-brand-sand/20 p-5">
            <h3 className="mb-4 text-xs sm:text-sm font-bold uppercase tracking-wide text-zinc-500">
              Resolucion
            </h3>
            <div className="my-3 border-t border-brand-sand/20" />
            <span className="font-semibold text-brand-forest">
              {dispute.resolution || "Pendiente de resolución"}
            </span>
          </div>

          {isAdmin && (
            <div className="mt-8 border-t border-brand-sand/30 pt-8 space-y-6">
              <h3 className="text-lg font-bold text-brand-forest flex items-center gap-2">
                ⚙️ Panel de Control del Admin
              </h3>

              <div className="space-y-4 rounded-xl bg-brand-beige/30 p-6 border border-brand-sand/30">

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-zinc-500">
                    Cambiar Estado
                  </label>
                  <select
                    disabled={isSaving}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full rounded-lg border border-brand-sand/40 bg-white p-2.5 text-sm text-brand-forest font-semibold focus:outline-none focus:ring-2 focus:ring-brand-sage/40"
                  >
                    <option value="OPEN">Abierta (OPEN)</option>
                    <option value="REVIEWING">En Revisión (REVIEWING)</option>
                    <option value="RESOLVED">Resuelta (RESOLVED)</option>
                    <option value="REJECTED">Rechazada (REJECTED)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-zinc-500">
                    Texto de Resolución
                  </label>
                  <textarea
                    disabled={isSaving}
                    value={newResolution}
                    onChange={(e) => setNewResolution(e.target.value)}
                    placeholder="Escribe aquí los motivos o detalles de la resolución..."
                    rows={4}
                    className="w-full rounded-lg border border-brand-sand/40 bg-white p-2.5 text-sm text-brand-forest font-semibold focus:outline-none focus:ring-2 focus:ring-brand-sage/40"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {saveSuccess ? (
                    <span className="text-sm font-bold text-brand-sage">
                      ✓ Cambios guardados correctamente
                    </span>
                  ) : (
                    <span />
                  )}

                  <button
                    disabled={isSaving}
                    onClick={handleSave}
                    className="rounded-lg bg-brand-forest text-brand-beige hover:bg-brand-sage px-5 py-2 text-sm font-bold shadow-md disabled:opacity-50 transition-colors cursor-pointer select-none"
                  >
                    {isSaving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}