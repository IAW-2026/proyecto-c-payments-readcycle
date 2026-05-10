import TransactionsList from "../../../components/ui/OperationList";

const disputes = [
  {
    id: "1",
    title: "Transaccion 58266",
    subtitle: "Cobro doble • En revision",
    amount: "$45000.00",
  },
  {
    id: "2",
    title: "Transaccion 34596",
    subtitle: "Fallo pago • En revision",
    amount: "$10,200.00",
  },
  {
    id: "3",
    title: "Transaccion 34589",
    subtitle: "Pago resuelto • Cerrado",
    amount: "$89.99",
  },
];

export default function TransactionsPage() {
  return (
    <main className="min-h-screen bg-zinc-100 p-8">

      <div className="mb-8">
        <h1 className="text-5xl font-bold text-zinc-800">
          Historial de disputas
        </h1>

        <p className="mt-2 text-zinc-500">
          Historial detallado de las disputas accionadas por tu cuenta.
        </p>
      </div>

      <TransactionsList
        title="Disputas"
        items={disputes}
      />

    </main>
  );
}