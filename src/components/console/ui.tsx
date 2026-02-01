import * as React from "react";

export function cn(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-1 text-sm text-zinc-600 dark:text-zinc-400", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  asChild?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  asChild,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 dark:focus-visible:ring-white/15 disabled:opacity-50 disabled:pointer-events-none";

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  };

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200",
    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
    ghost:
      "bg-transparent text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10",
    danger:
      "bg-red-600 text-white hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-400",
  };

  const resolvedClassName = cn(base, sizes[size], variants[variant], className);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: cn(resolvedClassName, child.props.className),
    });
  }

  return (
    <button
      className={resolvedClassName}
      {...props}
    >
      {children}
    </button>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 text-sm text-zinc-900 placeholder:text-zinc-500 shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-400 dark:focus:border-white/30 dark:focus:ring-white/10",
        className,
      )}
      {...props}
    />
  );
}

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "warning" | "danger";
};

export function Badge({ tone = "default", className, ...props }: BadgeProps) {
  const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
    default:
      "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-200",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200",
    warning: "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-100",
    danger: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-100",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
