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
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-2xl font-bold text-zinc-800">
        Detalles del Pago
      </h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-medium text-zinc-500">
            Fecha
          </span>
          <span className="font-semibold text-zinc-800">
            {date}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-zinc-500">
            Método de Pago
          </span>
          <span className="font-semibold text-zinc-800">
            💳 {paymentMethod}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-zinc-500">
            Estado
          </span>
          <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-600">
            {status}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-zinc-500">
            Numero de orden
          </span>
          <span className="font-semibold text-zinc-800">
            {orderID}
          </span>
        </div>
      </div>

      <div className="my-8 border-t border-zinc-200" />

      <div>
        <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-zinc-500">
          Desglose de Cargos
        </h3>

        <div className="rounded-xl bg-zinc-100 p-5">

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-600">
                Subtotal
              </span>
              <span className="font-medium text-zinc-700">
                {subtotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">
                Envio
              </span>
              <span className="font-medium text-zinc-700">
                {shipping}
              </span>
            </div>
          </div>

          <div className="my-4 border-t border-zinc-300" />

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-zinc-800">
              Total cargado
            </span>
            <span className="text-2xl font-bold text-zinc-800">
              {total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}