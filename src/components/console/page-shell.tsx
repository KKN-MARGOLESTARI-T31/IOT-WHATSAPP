import { Sidebar } from "./sidebar";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px]">
        <Sidebar />
        <div className="flex min-h-dvh flex-1 flex-col">
          <div className="flex-1 p-5 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
