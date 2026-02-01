export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-linear-to-b from-zinc-200/70 to-transparent blur-3xl dark:from-white/10" />
        <div className="absolute bottom-[-260px] left-[-180px] h-[520px] w-[520px] rounded-full bg-linear-to-tr from-zinc-200/70 to-transparent blur-3xl dark:from-white/10" />
      </div>

      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-10 lg:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-900 dark:bg-white" />
            <div className="text-sm font-semibold tracking-tight">Meta WA Console</div>
          </div>
          <a
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Open Console
          </a>
        </header>

        <main className="flex flex-1 flex-col justify-center">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
                UI • Neon → WhatsApp Cloud API
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Integrasi database Neon ke WhatsApp (Meta)
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Web ini dipakai khusus untuk mengelola konfigurasi integrasi: koneksi Neon (Postgres), setup kredensial
                Meta, mapping trigger, dan monitoring log pengiriman pesan.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/dashboard"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Masuk Dashboard
                </a>
                <a
                  href="/messages"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white/70 px-5 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Lihat Messages
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title: "Neon",
                    desc: "Simpan connection string dan source table/event.",
                  },
                  {
                    title: "Meta Cloud API",
                    desc: "Konfigurasi token, Phone Number ID, dan webhook.",
                  },
                  {
                    title: "Rules",
                    desc: "Mapping event DB → template pesan WhatsApp.",
                  },
                  {
                    title: "Logs",
                    desc: "Pantau status kirim pesan dan error.",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="text-sm font-semibold">{f.title}</div>
                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="text-sm font-semibold">Preview Console</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Kamu bisa langsung buka menu Dashboard, Neon, Meta, Mapping, dan Logs.
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { k: "Neon", v: "Not connected" },
                  { k: "Meta", v: "Not configured" },
                  { k: "Rules", v: "0 active" },
                  { k: "Last send", v: "—" },
                ].map((r) => (
                  <div
                    key={r.k}
                    className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white/60 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="text-zinc-600 dark:text-zinc-400">{r.k}</div>
                    <div className="font-medium text-zinc-900 dark:text-white">{r.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-10 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <div>Meta WA Console • UI only (belum ada backend)</div>
          <div>Next.js + Tailwind</div>
        </footer>
      </div>
    </div>
  );
}
