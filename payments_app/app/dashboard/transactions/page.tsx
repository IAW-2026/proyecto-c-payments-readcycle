"use client";

import TransactionsList from "../../../components/ui/OperationList";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import ErrorCard from "@/components/ui/ErrorCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/payments/transactions?page=${currentPage}&limit=5`);
        if (!res.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const responseData = await res.json();

        const transactionsData = responseData.data || [];
        const formattedTransactions = transactionsData.map((transaction: any) => ({
          id: transaction.id,
          title: transaction.orderId,
          subtitle: `${new Date(transaction.createdAt).toLocaleDateString("es-AR")} • ${transaction.status}`,
          amount: `$${transaction.amount}`,
        }));
        setTransactions(formattedTransactions);
        setTotalPages(responseData.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [currentPage]);

  if (loading) {
    return <LoadingSpinner message="Cargando historial de transacciones..." />;
  }

  if (error) {
    return (
      <ErrorCard
        title="Error al cargar transacciones"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-brand-beige flex flex-col justify-start p-6 sm:p-8 relative overflow-hidden font-sans">
      {/* Glows de fondo difusos para profundidad */}
      <div className="absolute top-[-10%] right-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-sage/5 blur-[100px] sm:blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-clay/5 blur-[100px] sm:blur-[120px] pointer-events-none select-none z-0" />

      <div className="mb-6 flex items-start justify-between z-10 w-full max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-forest tracking-tight">
            Historial de transacciones
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            Historial detallado de las transacciones accionadas por tu cuenta.
          </p>
        </div>

        <Link href="/dashboard" className="z-10 shrink-0">
          <Image
            src="/LogoSinTexto.png"
            alt="RC logo"
            width={70}
            height={20}
            priority
          />
        </Link>
      </div>

      <div className="z-10 w-full max-w-7xl mx-auto">
        <TransactionsList
          title="Transacciones"
          items={transactions}
          link="/dashboard/transactions"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </main>
  );
}