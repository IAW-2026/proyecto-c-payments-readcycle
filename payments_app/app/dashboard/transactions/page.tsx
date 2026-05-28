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

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/payments/transactions");
        if (!res.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const transactionsData = await res.json();
        const formattedTransactions = transactionsData.map((transaction: any) => ({
          id: transaction.id,
          title: transaction.orderId,
          subtitle: `${new Date(transaction.createdAt).toLocaleDateString("es-AR")} • ${transaction.status}`,
          amount: `$${transaction.amount}`,
        }));
        setTransactions(formattedTransactions);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

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
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-5xl font-bold text-zinc-800">
            Historial de transacciones
          </h1>

          <p className="mt-2 text-zinc-500">
            Historial detallado de las transacciones accionadas por tu cuenta.
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

      <TransactionsList
        title="Transacciones"
        items={transactions}
        link="/dashboard/transactions"
      />

    </main>
  );
}