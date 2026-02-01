import { Topbar } from "@/components/console/topbar";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/console/ui";

export default function NeonPage() {
  return (
    <div className="space-y-6">
      <Topbar
        title="Neon Database"
        subtitle="Konfigurasi koneksi Postgres (Neon). Nanti backend akan melakukan test-connection dan discovery schema."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Connection</CardTitle>
            <CardDescription>Gunakan connection string dari Neon (Postgres).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Connection string</div>
                <Input placeholder="postgresql://user:password@host/db?sslmode=require" />
                <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Best practice: simpan via environment variable / secret store, bukan hardcode.
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Schema</div>
                  <Input placeholder="public" />
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Table</div>
                  <Input placeholder="orders" />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Badge tone="warning">Not connected</Badge>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">UI-only status</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary">Test connection</Button>
                  <Button>Save</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Source</CardTitle>
            <CardDescription>Pilih strategi trigger (CDC/polling/webhook). UI placeholder.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="rounded-2xl border border-zinc-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="font-medium text-zinc-900 dark:text-white">Polling</div>
                <div className="mt-1 leading-6">Cocok untuk MVP. Backend akan mengecek perubahan periodik.</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="font-medium text-zinc-900 dark:text-white">CDC (logical replication)</div>
                <div className="mt-1 leading-6">Realtime-ish. Setup lebih kompleks (nanti).</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
