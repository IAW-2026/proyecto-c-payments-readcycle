import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-col flex-1 min-h-[calc(100vh-4rem)] bg-brand-beige overflow-hidden font-sans">
      {/* Glows de fondo difusos para profundidad */}
      <div className="absolute top-[-10%] right-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-brand-sage/10 blur-[100px] sm:blur-[130px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-brand-clay/5 blur-[100px] sm:blur-[130px] pointer-events-none select-none z-0" />

      <main className="relative flex flex-col flex-1 items-center justify-center w-full max-w-7xl mx-auto px-6 md:px-8 py-4 z-10">

        <Image
          src="/LogoSinTexto.png"
          alt="ReadCycle Logo"
          width={350}
          height={350}
          priority
          className="h-28 sm:h-36 w-auto object-contain mb-8 select-none pointer-events-none"
        />

        <div className="flex flex-col items-center gap-6 text-center max-w-5xl mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brand-forest leading-[1.15]">
            Simplificá tus pagos y <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-sage to-brand-clay bg-clip-text text-transparent">
              resolvé disputas sin fricciones
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-zinc-600 max-w-3xl">
            La plataforma de cobros y mediación de <strong>ReadCycle</strong> que conecta de forma transparente a compradores y vendedores con total seguridad en cada transacción.
          </p>
        </div>

        <div className="flex items-center justify-center w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="flex h-14 w-full sm:w-auto items-center justify-center rounded-full bg-brand-forest text-brand-beige px-12 font-semibold shadow-md transition-all duration-300 hover:bg-brand-sage hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer text-base"
          >
            Entrar al HUB del Panel
          </Link>
        </div>

      </main>
    </div>
  );
}
