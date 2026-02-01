import Link from "next/link";

import { Badge, Button, Input } from "./ui";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="truncate text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          <Badge tone="warning">Draft</Badge>
        </div>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="hidden items-center gap-2 lg:flex">
        <div className="w-[260px]">
          <Input placeholder="Search logs, tables, phone..." />
        </div>
        <Button variant="secondary" asChild>
          <Link href="/">Landing</Link>
        </Button>
        <Button asChild>
          <Link href="/console/dashboard">Console</Link>
        </Button>
      </div>
    </div>
  );
}
