"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="mb-8 text-2xl font-bold text-zinc-800">
            Detalles de disputa {dispute.id}
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">
                Fecha
              </span>

              <span className="font-semibold text-zinc-800">
                {new Date(dispute.createdAt).toLocaleDateString("es-AR")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">
                ID de Transaccion
              </span>

              <span className="font-semibold text-zinc-800">
                {dispute.transaction.orderId}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">
                Costo de transaccion
              </span>

              <span className="font-semibold text-zinc-800">
                {dispute.transaction.amount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">
                Estado
              </span>

              <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-600">
                {dispute.status}
              </span>
            </div>
          </div>

          <div className="my-8 border-t border-zinc-200" />

          <div className="rounded-xl bg-zinc-100 p-5">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-zinc-500">
              Motivo
            </h3>

            <div className="my-4 border-t border-zinc-300" />

            <span className="font-medium text-zinc-800">
              {dispute.reason}
            </span>
          </div>

          <div className="mt-6 rounded-xl bg-zinc-100 p-5">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-zinc-500">
              Resolucion
            </h3>

            <div className="my-4 border-t border-zinc-300" />

            <span className="font-medium text-zinc-800">
              {dispute.resolution || "Pendiente de resolución"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}