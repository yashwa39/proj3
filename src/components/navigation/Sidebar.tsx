import Link from "next/link";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/", label: "Home" },
  { href: "/#social", label: "Community" },
];

export function Sidebar() {
  return (
    <aside className="rounded-2xl border border-white/5 bg-surface/60 p-3">
      <nav aria-label="Dashboard navigation" className="space-y-1">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
