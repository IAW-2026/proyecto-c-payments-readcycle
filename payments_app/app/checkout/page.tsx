'use client';
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";

const cartItems = [
  {
    id: 1,
    title: "La Republica",
    subtitle: "May 10, 2024 • En proceso",
    amount: 26000,
  },
];

// Datos mock centralizados de comprador y vendedor para no tener que mockear en las APIs
const MOCK_CHECKOUT_DATA = {
  buyerId: "cmpoj8m160001xcto3sxcs6n2", // Valentino Villar (comprador)
  sellerId: "cmpon3asn0003xctoflgxiy95", // Alejo Quintana (vendedor)
  returnUrl: "https://fxsqcp5x-3001.brs.devtunnels.ms/dashboard/transactions", // Link único de retorno mock
};

export default function CheckoutPage() {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initMercadoPago(
      process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!,
      {
        locale: 'es-AR',
      }
    );
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const orderId = `ORDER-${Date.now()}`; //esto tambien es mock

      const res = await fetch(
        '/api/payments/checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          //Aca estoy mandando la preference armada
          body: JSON.stringify({
            buyerId: MOCK_CHECKOUT_DATA.buyerId,
            sellerId: MOCK_CHECKOUT_DATA.sellerId,
            orderId: orderId,
            returnUrl: MOCK_CHECKOUT_DATA.returnUrl,
            items: cartItems.map((item) => ({
              id: item.id,
              title: item.title,
              quantity: 1,
              unit_price: Number(item.amount),
            })),
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const detailsStr = errorData.details ? `\n\nDetalles: ${JSON.stringify(errorData.details, null, 2)}` : '';
        throw new Error(`${errorData.error || 'Error al crear la preferencia'}${detailsStr}`);
      }
      const data = await res.json();
      setPreferenceId(data.id);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

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
                  Subtotal
                </span>
                <span className="font-medium text-zinc-700">
                  $26,000.00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Envío
                </span>
                <span className="font-medium text-green-600">
                  Free
                </span>
              </div>
            </div>

            <div className="my-6 border-t border-zinc-200" />

            <div className="mb-6 flex items-center justify-between">
              <span className="text-2xl font-bold text-zinc-800">
                Total
              </span>
              <span className="text-3xl font-bold text-green-600">
                $26000.00
              </span>
            </div>
            {!preferenceId && (
              <button
                onClick={handlePayment}
                disabled={loading}
                className="mb-4 w-full rounded-xl bg-green-500 px-6 py-4 font-semibold text-white shadow-md transition-colors hover:bg-green-600 disabled:opacity-50"
              >
                {loading
                  ? 'Generando pago...'
                  : 'Comprar por Mercado Pago'}
              </button>
            )}
            {preferenceId && (
              <Wallet
                initialization={{
                  preferenceId,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}