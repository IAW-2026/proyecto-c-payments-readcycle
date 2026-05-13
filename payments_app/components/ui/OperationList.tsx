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
};

export default function TransactionsList({
  title,
  items,
  link,
}: TransactionsListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-zinc-800">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100">
            Filtrar
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        {items.map((item, index) => (
          <Link
            href={`${link}/${item.id}`}
            key={item.id}
            className={`flex items-center justify-between border-b border-zinc-100 px-6 py-5 transition-colors hover:bg-zinc-50 ${
              index === 0 ? "border-l-4 border-l-green-500 bg-green-50/40" : ""
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
                className={`text-lg font-bold ${
                  item.amount.startsWith("+")
                    ? "text-green-600"
                    : "text-zinc-700"
                }`}
              >
                {item.amount}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}