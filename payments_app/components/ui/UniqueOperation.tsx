"use client";

type PaymentDetailsProps = {
  date: string;
  paymentMethod: string;
  status: string;
  orderID: string;
  subtotal: string;
  shipping: string;
  total: string;
};

export default function PaymentDetails({
  date,
  paymentMethod,
  status,
  orderID,
  subtotal,
  shipping,
  total,
}: PaymentDetailsProps) {
  return (
    <div className="w-full rounded-2xl border border-brand-sand/40 bg-white p-8 shadow-sm transition-all hover:shadow-md duration-300">

      <h2 className="mb-8 text-2xl font-bold text-brand-forest">
        Detalles del Pago
      </h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-zinc-500 text-sm sm:text-base">
            Fecha
          </span>
          <span className="font-bold text-brand-forest text-sm sm:text-base">
            {date}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-zinc-500 text-sm sm:text-base">
            Método de Pago
          </span>
          <span className="font-bold text-brand-forest text-sm sm:text-base">
            💳 {paymentMethod}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-zinc-500 text-sm sm:text-base">
            Estado
          </span>
          <span className="rounded-lg bg-brand-sand/30 px-3 py-1 text-xs sm:text-sm font-semibold text-brand-forest">
            {status}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-zinc-500 text-sm sm:text-base">
            Numero de orden
          </span>
          <span className="font-bold text-brand-forest text-sm sm:text-base">
            {orderID}
          </span>
        </div>
      </div>

      <div className="my-8 border-t border-brand-sand/30" />

      <div>
        <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-zinc-500">
          Desglose de Cargos
        </h3>

        <div className="rounded-xl bg-brand-beige/50 border border-brand-sand/25 p-5">

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 font-medium">
                Subtotal
              </span>
              <span className="text-sm font-bold text-brand-forest">
                {subtotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 font-medium">
                Envio
              </span>
              <span className="text-sm font-bold text-brand-forest">
                {shipping}
              </span>
            </div>
          </div>

          <div className="my-4 border-t border-brand-sand/30" />

          <div className="flex items-center justify-between">
            <span className="text-base sm:text-lg font-bold text-brand-forest">
              Total cargado
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-brand-forest">
              {total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}