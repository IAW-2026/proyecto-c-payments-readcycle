import DashboardList from "../../components/ui/OperationsListDash";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

async function getTransactions() {
  const headersList = await headers();
  const res = await fetch(
    "http://localhost:3001/api/payments/transactions",
    {
      cache: "no-store",
      headers: {
        cookie: headersList.get("cookie") || "",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return res.json();
}

async function getDisputes() {
  const headersList = await headers();
  const res = await fetch(
    "http://localhost:3001/api/payments/disputes",
    {
      cache: "no-store",
      headers: {
        cookie: headersList.get("cookie") || "",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch disputes");
  }
  return res.json();
}

export default async function DashboardPage() {
  const [transactionsData, disputesData] = await Promise.all([
    getTransactions(),
    getDisputes(),
  ]);
  const transactions = transactionsData.map((transaction: any) => ({
    id: transaction.id,
    title: transaction.orderId,
    subtitle: `${new Date(transaction.createdAt).toLocaleDateString("es-AR")} • ${transaction.status}`,
    amount: `$${transaction.amount}`,
  }));
  const disputes = disputesData.map((dispute: any) => ({
    id: dispute.id,
    title: `Transaccion ${dispute.transaction?.orderId || "Orden sin identificar"}`,
    subtitle: `${dispute.reason} • ${dispute.status}`,
    amount: `$${dispute.transaction?.amount || 0}`,
  }));

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