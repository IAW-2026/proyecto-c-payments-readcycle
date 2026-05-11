import Link from "next/link";

type ListItem = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
};

type DashboardListProps = {
  title: string;
  items: ListItem[];
  link: string;
};

export default function DashboardList({
  title,
  items,
  link,
}: DashboardListProps) {
  return (
    <div className="flex h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-zinc-800">
          {title}
        </h2>
        <Link
          href={link}
          className="text-sm font-medium text-green-600 transition-colors hover:text-green-700">
            View All
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <Link
            href={`${link}/${item.id}`}
            key={item.id}
            className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 transition-colors hover:bg-zinc-50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                $
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-zinc-800">
                  {item.title}
                </span>
                <span className="text-sm text-zinc-500">
                  {item.subtitle}
                </span>
              </div>
            </div>
            {item.amount && (
              <span className="font-semibold text-zinc-700">
                {item.amount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}