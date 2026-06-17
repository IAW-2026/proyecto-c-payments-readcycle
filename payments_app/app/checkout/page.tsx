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
  buyerId: "cmpvkuebv000004jmxtaijm4u",
  sellerId: "cmpvktnxo000004il0wci25pi",
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

      // Obtener dinámicamente la URL base actual desde la ventana del navegador del usuario
      const currentOrigin = window.location.origin;
      const dynamicReturnUrl = `${currentOrigin}/dashboard/transactions`;

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
            returnUrl: dynamicReturnUrl,
            baseUrl: currentOrigin,
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
    <main className="min-h-[calc(100vh-4rem)] bg-brand-beige flex flex-col justify-start p-6 sm:p-8 relative overflow-hidden font-sans">
      {/* Glows de fondo difusos para profundidad */}
      <div className="absolute top-[-10%] right-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-sage/5 blur-[100px] sm:blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-clay/5 blur-[100px] sm:blur-[120px] pointer-events-none select-none z-0" />

      <div className="mb-8 z-10 w-full max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-forest tracking-tight">
          Carrito de Compra
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 z-10 w-full max-w-7xl mx-auto flex-1 items-start">
        {/* Sección de Productos */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-3xl border border-brand-sand/40 bg-white p-5 shadow-sm transition-all hover:shadow-md duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-sand/30 text-2xl select-none">
                    📘
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-brand-forest">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-500">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-lg font-extrabold text-brand-forest">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de Compra */}
        <div>
          <div className="rounded-3xl border border-brand-sand/40 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-brand-forest">
              Resumen de Compra
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-semibold">
                  Subtotal
                </span>
                <span className="font-bold text-brand-forest">
                  $26,000.00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-semibold">
                  Envío
                </span>
                <span className="font-bold text-brand-sage">
                  Free
                </span>
              </div>
            </div>

            <div className="my-6 border-t border-brand-sand/30" />

            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold text-brand-forest">
                Total
              </span>
              <span className="text-2xl font-extrabold text-brand-sage">
                $26,000.00
              </span>
            </div>

            {!preferenceId && (
              <button
                onClick={handlePayment}
                disabled={loading}
                className="mb-4 w-full rounded-xl bg-brand-sage hover:bg-brand-forest text-brand-beige px-6 py-4 font-bold shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer disabled:opacity-50 select-none text-sm"
              >
                {loading
                  ? 'Generando pago...'
                  : 'Comprar por Mercado Pago'}
              </button>
            )}
            {preferenceId && (
              <div className="z-20 relative">
                <Wallet
                  initialization={{
                    preferenceId,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}