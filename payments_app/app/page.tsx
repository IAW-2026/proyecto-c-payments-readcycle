import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <main className="flex flex-col items-center justify-center gap-8 text-center">
        <Image
          src="/LogoPng.png"
          alt="RC logo"
          width={300}
          height={50}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black">
            Pagos y denuncias
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600">
            Plataforma de administracion de pagos y disuptas.
            Para vendedores y compradores
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
              href="/dashboard"
              className="flex h-12 items-center justify-center rounded-full bg-green-600 px-6 text-white transition-colors hover:bg-green-700">
              Entrar al HUB
          </Link>
        </div>
      </main>
    </div>
  );
}
