import { Topbar } from "@/components/console/topbar";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/console/ui";

export default function MetaPage() {
  return (
    <div className="space-y-6">
      <Topbar
        title="Meta WhatsApp"
        subtitle="Konfigurasi kredensial Cloud API: Access Token, Phone Number ID, WABA ID, dan Webhook. UI-only dulu."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Credentials</CardTitle>
            <CardDescription>Masukkan data dari Meta Developer Dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Access token</div>
                <Input placeholder="EAAG..." type="password" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">WABA ID</div>
                  <Input placeholder="123456789" />
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Phone Number ID</div>
                  <Input placeholder="987654321" />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Badge tone="warning">Not configured</Badge>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">UI-only status</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary">Validate</Button>
                  <Button>Save</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Webhook</CardTitle>
            <CardDescription>Untuk menerima status message, delivery, dsb.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Callback URL</div>
                <Input placeholder="https://your-domain.com/api/webhook/meta" />
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Verify token</div>
                <Input placeholder="your-verify-token" />
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white/50 p-4 text-sm dark:border-white/10 dark:bg-white/5">
                <div className="font-medium text-zinc-900 dark:text-white">Tips</div>
                <div className="mt-1 leading-6 text-zinc-600 dark:text-zinc-400">
                  Jangan simpan Access Token di client. Nanti kita pindahkan ke server-side env dan buat endpoint test.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
