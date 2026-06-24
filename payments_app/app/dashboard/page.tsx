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
          fetch("/api/payments/transactions?page=1&limit=5"),
          fetch("/api/payments/disputes?page=1&limit=5"),
        ]);

        if (!transactionsRes.ok || !disputesRes.ok) {
          throw new Error("Error al obtener los datos de la base de datos");
        }

        const transactionsJson = await transactionsRes.json();
        const disputesJson = await disputesRes.json();

        const transactionsData = transactionsJson.data || [];
        const disputesData = disputesJson.data || [];

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
    <main className="min-h-[calc(100vh-4rem)] bg-brand-beige flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden font-sans">
      {/* Glows de fondo difusos para profundidad */}
      <div className="absolute top-[-10%] right-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-sage/5 blur-[100px] sm:blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-clay/5 blur-[100px] sm:blur-[120px] pointer-events-none select-none z-0" />

      <div className="mb-6 flex items-start justify-between z-10 w-full max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-forest tracking-tight">
            Datos de compras
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            Historiales actualizados de tus transacciones y disputas
          </p>
        </div>
        <Link href="/dashboard" className="z-10">
          <Image
            src="/LogoSinTexto.png"
            alt="RC logo"
            width={70}
            height={20}
            priority
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 z-10 w-full max-w-7xl mx-auto flex-1 items-stretch">
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


    </main>
  );
}