import PaymentDetails from "../../../../components/ui/UniqueOperation";
import { headers } from "next/headers";

async function getTransaction(id: string) {
  const headersList = await headers();
  const res = await fetch(
    `http://localhost:3001/api/payments/transactions/${id}`,
    {
      cache: "no-store",
      headers: {
        cookie: headersList.get("cookie") || "",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch transaction");
  }
  return res.json();
}

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const transaction = await getTransaction(id);

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