"use client";

import PaymentDetails from "../../../../components/ui/UniqueOperation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

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

  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  const [newStatus, setNewStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isAdmin = clerkLoaded && Array.isArray(clerkUser?.publicMetadata?.roles)
    ? (clerkUser.publicMetadata.roles as string[]).includes("ADMIN")
    : false;

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

        setNewStatus(data.status);
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

  const handleSave = async () => {
    if (!id) return;

    try {
      setIsSaving(true);
      setSaveSuccess(false);

      const res = await fetch(`/api/payments/transactions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update transaction");
      }

      const updatedTransaction = await res.json();
      setTransaction(updatedTransaction);
      setSaveSuccess(true);

      // Timer de notificacion???
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

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
      <div className="mx-auto max-w-2xl space-y-6">
        <PaymentDetails
          date={new Date(transaction.createdAt).toLocaleDateString("es-AR")}
          paymentMethod={transaction.paymentMethod || "No especificado"}
          status={transaction.status}
          orderID={transaction.orderId}
          subtotal={`$${transaction.amount}`}
          shipping="$0"
          total={`$${transaction.amount}`}
        />

        {isAdmin && (
          <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-zinc-800">
              ⚙️ Panel de Control del Admin
            </h3>

            <div className="space-y-4 rounded-xl bg-zinc-50 p-6 border border-zinc-200">

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-zinc-600">
                  Cambiar Estado de la Transacción
                </label>
                <select
                  disabled={isSaving}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800"
                >
                  <option value="PENDING">Pendiente (PENDING)</option>
                  <option value="APPROVED">Aprobada (APPROVED)</option>
                  <option value="REJECTED">Rechazada (REJECTED)</option>
                  <option value="REFUNDED">Reembolsada (REFUNDED)</option>
                  <option value="CANCELLED">Cancelada (CANCELLED)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                {saveSuccess ? (
                  <span className="text-sm font-semibold text-green-600">
                    ✓ Cambios guardados correctamente
                  </span>
                ) : (
                  <span />
                )}

                <button
                  disabled={isSaving}
                  onClick={handleSave}
                  className="rounded-lg bg-zinc-800 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-zinc-700 disabled:opacity-50 transition-colors cursor-pointer select-none"
                >
                  {isSaving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}