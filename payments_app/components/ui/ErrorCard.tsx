"use client";

type ErrorCardProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
};

export default function ErrorCard({
  title = "Error",
  message,
  onRetry,
  fullScreen = true,
}: ErrorCardProps) {
  const containerClasses = fullScreen
    ? "min-h-screen bg-zinc-100 p-8 flex items-center justify-center"
    : "flex items-center justify-center p-8 w-full";

  return (
    <div className={containerClasses}>
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm max-w-md w-full text-center">
        <p className="text-red-500 font-bold text-lg mb-2">{title}</p>
        <p className="text-zinc-600 mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-xl bg-zinc-800 px-6 py-2.5 font-semibold text-white shadow-md hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
