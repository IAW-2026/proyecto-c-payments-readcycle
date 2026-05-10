import DashboardList from "../../components/ui/OperationsListDash";
import Image from "next/image";
import Link from "next/link";

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

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">
            Datos de compras
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Historiales actualizados de tus transacciones y disputas
          </p>
        </div>
          <Image
            src="/LogoSinTexto.png"
            alt="RC logo"
            width={70}
            height={20}
            priority
          />
        </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardList
          title="Transacciones"
          items={transactions}
          link="/dashboard/transactions"
        />
        <DashboardList
          title="Disputas"
          items={disputes}
          link="/dashboard/disputes"
        />
      </div>

      <div className="mt-10 flex justify-center gap-20">
        <Link
          href="/checkout"
          className="rounded-xl bg-green-500 px-8 py-4 font-semibold text-white shadow-md transition-colors hover:bg-green-600">
            Pagar ahora
        </Link>
        <Link
          href="/dashboard/disputes/new"
          className="rounded-xl bg-green-500 px-8 py-4 font-semibold text-white shadow-md transition-colors hover:bg-green-600">
            Crear disputa
        </Link>
      </div>
    </main>
  );
}