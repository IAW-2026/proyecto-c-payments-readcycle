"use client";

import Link from "next/link";

type TransactionItem = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
};

type TransactionsListProps = {
  title: string;
  items: TransactionItem[];
  link: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export default function TransactionsList({
  title,
  items,
  link,
  currentPage,
  totalPages,
  onPageChange,
}: TransactionsListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-zinc-800">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {currentPage && totalPages && onPageChange ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-500 mr-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-white"
                aria-label="Página anterior"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-white"
                aria-label="Página siguiente"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
            <span className="text-4xl mb-2">📁</span>
            <p className="text-sm">No se encontraron registros</p>
          </div>
        ) : (
          items.map((item, index) => (
            <Link
              href={`${link}/${item.id}`}
              key={item.id}
              className={`flex items-center justify-between border-b border-zinc-100 px-6 py-5 transition-colors hover:bg-zinc-50 ${index === 0 ? "border-l-4 border-l-green-500 bg-green-50/40" : ""
                }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-xl">
                  💳
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`text-lg font-bold ${item.amount.startsWith("+")
                      ? "text-green-600"
                      : "text-zinc-700"
                    }`}
                >
                  {item.amount}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}