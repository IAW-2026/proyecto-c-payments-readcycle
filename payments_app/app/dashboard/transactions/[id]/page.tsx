"use client";

import PaymentDetails from "../../../../components/ui/UniqueOperation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorCard from "@/components/ui/ErrorCard";

interface Transaction {
  id: string;
  createdAt: string;
  paymentMethod: string | null;
  status: string;
  orderId: string;
  amount: number;
}

export default function PaymentPage() {
  const params = useParams();
  const id = params?.id as string;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchTransaction() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/payments/transactions/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch transaction");
        }
        const data = await res.json();
        setTransaction(data);
      } catch (err) {
        console.error(err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch transaction";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchTransaction();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Cargando detalles del pago..." />;
  }

  if (error || !transaction) {
    return (
      <ErrorCard
        title="Error"
        message={error || "No se encontró la transacción"}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mx-auto max-w-2xl">
        <PaymentDetails
          date={new Date(transaction.createdAt).toLocaleDateString("es-AR")}
          paymentMethod={transaction.paymentMethod || "No especificado"}
          status={transaction.status}
          orderID={transaction.orderId}
          subtotal={`$${transaction.amount}`}
          shipping="$0"
          total={`$${transaction.amount}`}
        />
      </div>
    </main>
  );
}