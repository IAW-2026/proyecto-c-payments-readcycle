"use client";

import DashboardList from "../../components/ui/OperationsListDash";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import ErrorCard from "@/components/ui/ErrorCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [transactionsRes, disputesRes] = await Promise.all([
          fetch("/api/payments/transactions"),
          fetch("/api/payments/disputes"),
        ]);

        if (!transactionsRes.ok || !disputesRes.ok) {
          throw new Error("Error al obtener los datos de la base de datos");
        }

        const transactionsData = await transactionsRes.json();
        const disputesData = await disputesRes.json();

        const formattedTransactions = transactionsData.map((transaction: any) => ({
          id: transaction.id,
          title: transaction.orderId,
          subtitle: `${new Date(transaction.createdAt).toLocaleDateString("es-AR")} • ${transaction.status}`,
          amount: `$${transaction.amount}`,
        }));

        const formattedDisputes = disputesData.map((dispute: any) => ({
          id: dispute.id,
          title: `Transaccion ${dispute.transaction?.orderId || "Orden sin identificar"}`,
          subtitle: `${dispute.reason} • ${dispute.status}`,
          amount: `$${dispute.transaction?.amount || 0}`,
        }));

        setTransactions(formattedTransactions);
        setDisputes(formattedDisputes);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Cargando panel de compras..." />;
  }

  if (error) {
    return (
      <ErrorCard
        title="Error al cargar datos"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">
            Datos de compras
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Historiales actualizados de tus transacciones y disputas
          </p>
        </div>
        <Link href="/dashboard">
          <Image
            src="/LogoSinTexto.png"
            alt="RC logo"
            width={70}
            height={20}
            priority
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardList
          title="Transacciones"
          items={transactions}
          link="/dashboard/transactions"
        />
        <DashboardList
          title="Disputas"
          items={disputes}
          link="/dashboard/disputes"
        />
      </div>

      <div className="mt-10 flex justify-center gap-20">
        <Link
          href="/checkout"
          className="rounded-xl bg-green-500 px-8 py-4 font-semibold text-white shadow-md transition-colors hover:bg-green-600"
        >
          Simular Pago
        </Link>
        <Link
          href="/dashboard/disputes/new"
          className="rounded-xl bg-green-500 px-8 py-4 font-semibold text-white shadow-md transition-colors hover:bg-green-600"
        >
          Crear disputa
        </Link>
      </div>
    </main>
  );
}