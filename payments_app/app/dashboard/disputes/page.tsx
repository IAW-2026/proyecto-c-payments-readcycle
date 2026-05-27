import DisputesList from "../../../components/ui/OperationList";
import Link from "next/link";
import Image from "next/image";

import { headers } from "next/headers";

async function getDisputes() {
  const headersList = await headers();

  const res = await fetch(
    "http://localhost:3001/api/payments/disputes",
    {
      cache: "no-store",

      headers: {
        cookie: headersList.get("cookie") || "",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch disputes");
  }
  return res.json();
}

export default async function DisputesPage() {
  const disputesData = await getDisputes();

  const disputes = disputesData.map((dispute: any) => ({
    id: dispute.id,
    title:dispute.transaction?.orderId || "Orden sin identificar",
    subtitle: `${dispute.reason} • ${dispute.status}`,
    amount: `$${dispute.transaction?.amount || 0}`,
  }));

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