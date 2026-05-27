import TransactionsList from "../../../components/ui/OperationList";
import Link from "next/link";
import Image from "next/image";

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

export default async function TransactionsPage() {
  const transactionsData = await getTransactions();
  const transactions = transactionsData.map((transaction: any) => ({
    id: transaction.id,
    title: transaction.orderId,
    subtitle: `${new Date(transaction.createdAt).toLocaleDateString("es-AR")} • ${transaction.status}`,
    amount: `$${transaction.amount}`,
  }));

  return (
    <main className="min-h-screen bg-zinc-100 p-8">

      <div className="mb-8 flex item-start justify-between">
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