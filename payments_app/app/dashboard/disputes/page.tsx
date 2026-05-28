"use client";

import DisputesList from "../../../components/ui/OperationList";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Dispute {
  id: string;
  reason: string;
  status: string;
  transaction?: {
    orderId?: string;
    amount?: number;
  };
}

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorCard from "@/components/ui/ErrorCard";

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDisputes() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/payments/disputes");
        if (!res.ok) {
          throw new Error("Failed to fetch disputes");
        }
        const data = await res.json();
        setDisputes(data);
      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch disputes";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchDisputes();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Cargando historial de disputas..." />;
  }

  if (error) {
    return (
      <ErrorCard
        title="Error"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const mappedDisputes = disputes.map((dispute) => ({
    id: dispute.id,
    title: dispute.transaction?.orderId || "Orden sin identificar",
    subtitle: `${dispute.reason} • ${dispute.status}`,
    amount: `$${dispute.transaction?.amount || 0}`,
  }));

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-5xl font-bold text-zinc-800">
            Historial de disputas
          </h1>

          <p className="mt-2 text-zinc-500">
            Historial detallado de las disputas accionadas por tu cuenta.
          </p>
        </div>

        <Link
          href="/dashboard">
          <Image
            src="/LogoSinTexto.png"
            alt="RC logo"
            width={70}
            height={20}
            priority
          />
        </Link>
      </div>

      <DisputesList
        title="Disputas"
        items={mappedDisputes}
        link="/dashboard/disputes"
      />
    </main>
  );
}