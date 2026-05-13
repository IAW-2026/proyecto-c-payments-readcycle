const dispute = {
    id: "1",
    date: "10 May 2024",
    transID: "Transaccion 58266",
    status: "Resuelta",
    reason: "Se cobro dos veces en mi cuenta",
    resolution: "Dinero adjudicado de nuevo en forma de cupon",
  };

export default function DisputePage() {
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
                {dispute.date}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">
                ID de Transaccion 
              </span>
              <span className="font-semibold text-zinc-800">
                {dispute.transID}
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

          <div>
            <div className="rounded-xl bg-zinc-100 p-5">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-zinc-500">
                Motivo
              </h3>
              <div className="my-4 border-t border-zinc-300" />
              <span className="font-medium text-zinc-800">
                {dispute.reason}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-100 p-5">
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