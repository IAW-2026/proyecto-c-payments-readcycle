"use client";

type LoadingSpinnerProps = {
  message?: string;
  fullScreen?: boolean;
};

export default function LoadingSpinner({
  message = "Cargando...",
  fullScreen = true,
}: LoadingSpinnerProps) {
  const containerClasses = fullScreen
    ? "min-h-screen bg-zinc-100 p-8 flex items-center justify-center"
    : "flex flex-col items-center justify-center p-8 w-full";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-800" />
        <span className="text-zinc-600 font-semibold">{message}</span>
      </div>
    </div>
  );
}
