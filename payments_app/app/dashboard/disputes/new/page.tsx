export default function CreateDisputePage() {
  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-700">
            Procedimiento Legal
          </p>
          <h1 className="text-5xl font-bold text-zinc-900">
            Crear Disputa
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
            Complete los detalles a continuación para iniciar un proceso de
            reclamación sobre una transacción específica.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <form className="space-y-8">
            <div>
              <label className="mb-3 block text-lg font-semibold text-zinc-800">
                Transacción
              </label>
              <input
                type="text"
                placeholder="Ingrese el ID de la transacción"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-4 text-zinc-800 outline-none transition-colors focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-3 block text-lg font-semibold text-zinc-800">
                Fecha del Incidente
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-4 text-zinc-800 outline-none transition-colors focus:border-green-500"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-lg font-semibold text-zinc-800">
                  Motivo de la Disputa
                </label>
                <span className="text-sm text-zinc-500">
                  0 / 500
                </span>
              </div>
              <textarea
                placeholder="Describa detalladamente el problema con esta transacción..."
                maxLength={500}
                rows={7}
                className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-4 text-zinc-800 outline-none transition-colors focus:border-green-500"
              />
              <p className="mt-2 text-sm text-zinc-500">
                Sea lo más específico posible para acelerar la resolución.
              </p>
            </div>

            <div className="border-t border-zinc-200" />

            <div>
              <button
                type="submit"
                className="rounded-xl bg-green-600 px-8 py-4 font-semibold text-white shadow-md transition-colors hover:bg-green-700"
              >
                Enviar Disputa
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}