import { PageShell } from "@/components/console/page-shell";

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return <PageShell>{children}</PageShell>;
}
