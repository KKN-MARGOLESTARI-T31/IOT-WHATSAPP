import Link from "next/link";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/console/ui";

export default function ConsoleIndexPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 p-6 shadow-sm dark:border-white/10 dark:from-white/10 dark:to-white/5 lg:p-8">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Quick start
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Setup integrasi Neon → WhatsApp (Meta)
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Konfigurasikan database Neon, kredensial Meta, lalu tentukan mapping event supaya perubahan data di
            Neon bisa memicu pesan WhatsApp.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/console/neon">Connect Neon</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/console/meta">Setup Meta</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/console/logs">View Logs</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Neon Database</CardTitle>
            <CardDescription>Set connection string dan pilih source table.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Simulasikan validasi dan health-check (UI). Nanti backend akan menguji koneksi sebenarnya.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Meta WhatsApp</CardTitle>
            <CardDescription>Token, Phone Number ID, Webhook verify token.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Simpan kredensial aman via env / secrets manager (nanti).
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mapping & Rules</CardTitle>
            <CardDescription>Tentukan template pesan dan trigger event.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Atur aturan: insert/update/delete, filter kolom, dan routing nomor tujuan.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
