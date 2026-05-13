import DisputesList from "../../../components/ui/OperationList";
import Link from "next/link";
import Image from "next/image";

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

export default function DisputesPage() {
  return (
    <main className="min-h-screen bg-zinc-100 p-8">

      <div className="mb-8 flex item-start justify-between">
        <div>
          <h1 className="text-5xl font-bold text-zinc-800">
            Historial de disputas
          </h1>

          <p className="mt-2 text-zinc-500">
            Historial detallado de las disputas accionadas por tu cuenta.
          </p>
        </div>

        <Link
            href="/dashboard">
            <Image
              src="/LogoSinTexto.png"
              alt="RC logo"
              width={70}
              height={20}
              priority
            />
          </Link>
      </div>

      <DisputesList
        title="Disputas"
        items={disputes}
        link="/dashboard/disputes"
      />

    </main>
  );
}