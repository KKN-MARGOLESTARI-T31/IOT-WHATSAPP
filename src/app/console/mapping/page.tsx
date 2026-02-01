import { Topbar } from "@/components/console/topbar";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/console/ui";

function RuleRow({ name, trigger, status }: { name: string; trigger: string; status: "draft" | "active" }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{name}</div>
        <div className="mt-1 truncate text-xs text-zinc-600 dark:text-zinc-400">Trigger: {trigger}</div>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone={status === "active" ? "success" : "warning"}>{status}</Badge>
        <Button variant="secondary" size="sm">Edit</Button>
        <Button size="sm">Open</Button>
      </div>
    </div>
  );
}

export default function MappingPage() {
  return (
    <div className="space-y-6">
      <Topbar
        title="Mapping & Rules"
        subtitle="Definisikan aturan: event DB → template pesan WhatsApp. Ini masih UI placeholder."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rules</CardTitle>
              <CardDescription>Daftar mapping yang aktif/draft.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <RuleRow name="Order Created → Send Confirmation" trigger="public.orders on INSERT" status="draft" />
                <RuleRow name="Payment Paid → Send Receipt" trigger="public.payments on UPDATE" status="draft" />
                <RuleRow name="Low Stock → Notify Admin" trigger="public.inventory on UPDATE" status="draft" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Message Template Preview</CardTitle>
              <CardDescription>Preview isi pesan sebelum dikirim.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm dark:border-white/10 dark:bg-black">
                <div className="text-zinc-500 dark:text-zinc-400">To:</div>
                <div className="font-medium text-zinc-900 dark:text-white">+62xxxxxxxxxxx</div>
                <div className="mt-3 text-zinc-500 dark:text-zinc-400">Body:</div>
                <div className="mt-1 whitespace-pre-wrap text-zinc-800 dark:text-zinc-100">
                  {"Halo {{customer_name}},\n\nOrder {{order_id}} sudah kami terima.\nTotal: {{total}}\n\nTerima kasih!"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Rule</CardTitle>
              <CardDescription>Wizard singkat (UI).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Rule name</div>
                  <Input placeholder="e.g. Order Created → Send WA" />
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Trigger</div>
                  <Input placeholder="public.orders INSERT" />
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Destination phone</div>
                  <Input placeholder="+62..." />
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1">Save draft</Button>
                  <Button className="flex-1">Activate</Button>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Nanti backend akan validasi schema, kolom, dan ketersediaan template.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Ringkasan cepat.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Total rules</span>
                  <span className="font-medium text-zinc-900 dark:text-white">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Active</span>
                  <span className="font-medium text-zinc-900 dark:text-white">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Draft</span>
                  <span className="font-medium text-zinc-900 dark:text-white">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
