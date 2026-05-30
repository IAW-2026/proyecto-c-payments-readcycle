'use client';

import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs';

export default function AuthButtons() {
  return (
    <div className="flex items-center gap-4">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="text-zinc-600 hover:text-brand-forest font-medium text-sm transition-colors cursor-pointer px-4 py-2 rounded-full hover:bg-brand-sand/40">
            Iniciar Sesión
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="bg-brand-forest text-brand-beige hover:bg-brand-sage rounded-full font-medium text-sm h-11 px-6 cursor-pointer transition-all shadow-sm hover:shadow active:scale-95">
            Registrarse
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
