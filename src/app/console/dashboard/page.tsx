import { Topbar } from "@/components/console/topbar";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/console/ui";

function Stat({ label, value, tone }: { label: string; value: string; tone?: "default" | "success" | "warning" | "danger" }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{value}</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge tone={tone ?? "default"}>{tone ? tone.toUpperCase() : "INFO"}</Badge>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Topbar
        title="Dashboard"
        subtitle="Ringkasan status integrasi Neon → WhatsApp. Ini masih UI dummy (tanpa backend)."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Neon Connection" value="Not connected" tone="warning" />
        <Stat label="Meta Token" value="Not configured" tone="warning" />
        <Stat label="Active Rules" value="0" />
        <Stat label="Messages (24h)" value="0" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Preview event yang nanti akan muncul dari CDC/webhook.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { t: "DB", msg: "Listening for changes…", tone: "default" as const },
                { t: "WA", msg: "No message sent yet", tone: "default" as const },
                { t: "Rules", msg: "Create your first mapping", tone: "warning" as const },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white/50 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-xl bg-zinc-900/10 text-xs font-semibold text-zinc-700 grid place-items-center dark:bg-white/10 dark:text-zinc-200">
                      {row.t}
                    </div>
                    <div className="text-zinc-700 dark:text-zinc-200">{row.msg}</div>
                  </div>
                  <Badge tone={row.tone}>{row.tone}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Health</CardTitle>
            <CardDescription>Checklist cepat sebelum go-live.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                "Neon connection string tersimpan",
                "Meta Access Token valid",
                "Webhook verify token sesuai",
                "At least 1 mapping rule",
              ].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-zinc-100/60 dark:hover:bg-white/5">
                  <div className="text-zinc-700 dark:text-zinc-200">{item}</div>
                  <Badge tone="warning">pending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
