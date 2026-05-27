const cartItems = [
  {
    id: "1",
    title: "La Republica",
    subtitle: "May 10, 2024 • En proceso",
    amount: "$26,000.00",
  },
  {
    id: "2",
    title: "Como hacer amigos e influenciar a las personas",
    subtitle: "May 10, 2024 • En proceso",
    amount: "$12,500.00",
  },
];

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-zinc-100 p-8">

      <h1 className="mb-8 text-4xl font-bold text-zinc-800">
        Carrito de Compra
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >

                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 text-2xl">
                    📘
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-800">
                      {item.title}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-lg font-bold text-zinc-800">
                    {item.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-2xl font-bold text-zinc-800">
              Resumen de Compra
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Subtotal (3 productos)
                </span>
                <span className="font-medium text-zinc-700">
                  $57,276.00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Envío
                </span>
                <span className="font-medium text-green-600">
                  10,000.00
                </span>
              </div>
            </div>

            <div className="my-6 border-t border-zinc-200" />

            <div className="mb-6 flex items-center justify-between">
              <span className="text-2xl font-bold text-zinc-800">
                Total
              </span>
              <span className="text-3xl font-bold text-green-600">
                $67,276.00
              </span>
            </div>

            <button className="mb-4 w-full rounded-xl bg-green-500 px-6 py-4 font-semibold text-white shadow-md transition-colors hover:bg-green-600">
              Comprar por Mercado Pago
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}