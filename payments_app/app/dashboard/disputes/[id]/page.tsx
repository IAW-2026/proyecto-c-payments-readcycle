import { headers } from "next/headers";

async function getDispute(id: string) {
  const headersList = await headers();

  const res = await fetch(
    `http://localhost:3001/api/payments/disputes/${id}`,
    {
      cache: "no-store",

      headers: {
        cookie: headersList.get("cookie") || "",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch dispute");
  }
  return res.json();
}

export default async function DisputePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dispute = await getDispute(id);

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="mb-8 text-2xl font-bold text-zinc-800">
            Detalles de disputa {dispute.id}
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">
                Fecha
              </span>

              <span className="font-semibold text-zinc-800">
                {new Date(dispute.createdAt).toLocaleDateString("es-AR")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">
                ID de Transaccion
              </span>

              <span className="font-semibold text-zinc-800">
                {dispute.transaction.orderId}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">
                Costo de transaccion
              </span>

              <span className="font-semibold text-zinc-800">
                {dispute.transaction.amount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">
                Estado
              </span>

              <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-600">
                {dispute.status}
              </span>
            </div>
          </div>

          <div className="my-8 border-t border-zinc-200" />

          <div className="rounded-xl bg-zinc-100 p-5">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-zinc-500">
              Motivo
            </h3>

            <div className="my-4 border-t border-zinc-300" />

            <span className="font-medium text-zinc-800">
              {dispute.reason}
            </span>
          </div>

          <div className="mt-6 rounded-xl bg-zinc-100 p-5">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-zinc-500">
              Resolucion
            </h3>

            <div className="my-4 border-t border-zinc-300" />

            <span className="font-medium text-zinc-800">
              {dispute.resolution}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}