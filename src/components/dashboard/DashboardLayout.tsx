import type { ReactNode } from "react";

import { Sidebar } from "@/components/navigation/Sidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-[240px_1fr]">
      <Sidebar />
      <div>{children}</div>
    </div>
  );
}
