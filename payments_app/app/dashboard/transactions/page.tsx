import TransactionsList from "../../../components/ui/OperationList";

const transactions = [
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
  {
    id: "3",
    title: "Metro 2033",
    subtitle: "May 1, 2024 • Cerrado",
    amount: "$15,000.50",
  },
  {
    id: "4",
    title: "Metro 2034",
    subtitle: "May 1, 2024 • Cerrado",
    amount: "$20,000.00",
  },
];

export default function TransactionsPage() {
  return (
    <main className="min-h-screen bg-zinc-100 p-8">

      <div className="mb-8">
        <h1 className="text-5xl font-bold text-zinc-800">
          Historial de transacciones
        </h1>

        <p className="mt-2 text-zinc-500">
          Historial detallado de las transacciones accionadas por tu cuenta.
        </p>
      </div>

      <TransactionsList
        title="Transacciones"
        items={transactions}
      />

    </main>
  );
}