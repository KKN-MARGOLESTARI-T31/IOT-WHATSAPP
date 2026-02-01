import { Topbar } from "@/components/console/topbar";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/console/ui";

type LogRow = {
  ts: string;
  source: "neon" | "meta" | "rules";
  message: string;
  level: "info" | "warn" | "error";
};

const rows: LogRow[] = [
  { ts: "2026-02-01 14:30:12", source: "rules", message: "Console UI initialized", level: "info" },
  { ts: "2026-02-01 14:30:18", source: "neon", message: "Waiting for connection", level: "warn" },
  { ts: "2026-02-01 14:30:22", source: "meta", message: "Missing access token", level: "warn" },
];

function tone(level: LogRow["level"]) {
  if (level === "error") return "danger" as const;
  if (level === "warn") return "warning" as const;
  return "default" as const;
}

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <Topbar
        title="Logs"
        subtitle="Event log untuk integrasi (UI dummy). Nanti akan diisi dari backend + webhook callback."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search dan filter sederhana.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Query</div>
                <Input placeholder="e.g. orders, token, 400" />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1">Apply</Button>
                <Button className="flex-1">Export</Button>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Export nanti bisa CSV/JSON.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Log terbaru.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rows.map((r, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white/50 p-4 text-sm dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">{r.ts}</div>
                      <Badge tone={tone(r.level)}>{r.level}</Badge>
                      <Badge>{r.source}</Badge>
                    </div>
                    <div className="mt-2 truncate text-zinc-800 dark:text-zinc-100">{r.message}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">Details</Button>
                    <Button size="sm">Retry</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
