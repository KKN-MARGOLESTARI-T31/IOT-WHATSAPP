"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { IconActivity, IconDatabase, IconGrid, IconMessage, IconPlug, LogoMark } from "./icons";
import { cn } from "./ui";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const nav: NavItem[] = [
  { href: "/console/dashboard", label: "Dashboard", icon: <IconGrid className="h-5 w-5" /> },
  { href: "/console/neon", label: "Neon Database", icon: <IconDatabase className="h-5 w-5" /> },
  { href: "/console/meta", label: "Meta WhatsApp", icon: <IconMessage className="h-5 w-5" /> },
  { href: "/console/mapping", label: "Mapping & Rules", icon: <IconPlug className="h-5 w-5" /> },
  { href: "/console/logs", label: "Logs", icon: <IconActivity className="h-5 w-5" /> },
];

function isActive(pathname: string, href: string) {
  if (href === "/console/dashboard") return pathname === href || pathname === "/console";
  return pathname === href;
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-dvh w-[280px] flex-col border-r border-zinc-200 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-black/10 lg:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="h-9 w-9 rounded-xl bg-zinc-900 p-1.5 dark:bg-white">
          <LogoMark className="h-full w-full" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
            Meta WA Console
          </div>
          <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">
            Neon → WhatsApp (Meta)
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {nav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10",
              )}
            >
              <span className={cn(active ? "text-white dark:text-zinc-950" : "text-zinc-500 dark:text-zinc-300")}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
          <div className="font-medium text-zinc-900 dark:text-white">UI only</div>
          <div className="mt-1 leading-5">
            Halaman ini belum konek ke Neon atau Meta API. Nanti kita sambungkan backend.
          </div>
        </div>
      </div>
    </aside>
  );
}
