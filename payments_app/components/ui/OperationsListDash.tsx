"use client";

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
    <div className="flex h-[360px] w-full flex-col overflow-hidden rounded-2xl border border-brand-sand/40 bg-white shadow-sm transition-all hover:shadow-md duration-300">

      <div className="flex items-center justify-between border-b border-brand-sand/30 bg-brand-beige/10 px-5 py-4">
        <h2 className="text-lg font-bold text-brand-forest">
          {title}
        </h2>
        <Link
          href={link}
          className="text-sm font-semibold text-brand-sage transition-colors hover:text-brand-forest"
        >
          View All
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-brand-sand/10">
        {items.map((item) => (
          <Link
            href={`${link}/${item.id}`}
            key={item.id}
            className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-brand-beige/30"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-sage/10 text-brand-sage text-base select-none">
                $
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-brand-forest line-clamp-1">
                  {item.title}
                </span>
                <span className="text-sm text-zinc-500">
                  {item.subtitle}
                </span>
              </div>
            </div>
            {item.amount && (
              <span className="font-extrabold text-brand-forest shrink-0">
                {item.amount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}