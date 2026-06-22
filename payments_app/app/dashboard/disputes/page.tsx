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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchDisputes() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/payments/disputes?page=${currentPage}&limit=5`);
        if (!res.ok) {
          throw new Error("Failed to fetch disputes");
        }
        const responseData = await res.json();

        setDisputes(responseData.data || []);
        setTotalPages(responseData.totalPages || 1);
      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch disputes";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchDisputes();
  }, [currentPage]);

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
    <main className="min-h-[calc(100vh-4rem)] bg-brand-beige flex flex-col justify-start p-6 sm:p-8 relative overflow-hidden font-sans">
      {/* Glows de fondo difusos para profundidad */}
      <div className="absolute top-[-10%] right-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-sage/5 blur-[100px] sm:blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-clay/5 blur-[100px] sm:blur-[120px] pointer-events-none select-none z-0" />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 z-10 w-full max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-forest tracking-tight">
            Historial de disputas
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            Historial detallado de las disputas accionadas por tu cuenta.
          </p>
        </div>
        
        <div className="flex items-center gap-4 z-10 shrink-0">
          <Link
            href="/dashboard/disputes/new"
            className="rounded-xl bg-brand-clay text-brand-beige px-6 py-3 font-bold shadow-md transition-all duration-300 hover:bg-brand-clay/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer text-sm"
          >
            Crear disputa
          </Link>
          <Link href="/dashboard" className="shrink-0">
            <Image
              src="/LogoSinTexto.png"
              alt="RC logo"
              width={70}
              height={20}
              priority
            />
          </Link>
        </div>
      </div>

      <div className="z-10 w-full max-w-7xl mx-auto">
        <DisputesList
          title="Disputas"
          items={mappedDisputes}
          link="/dashboard/disputes"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </main>
  );
}