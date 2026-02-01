import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export function LogoMark(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <path
        d="M32 6C19.85 6 10 15.85 10 28c0 8.66 4.99 16.16 12.25 19.78L18 58l11.2-6.16c.92.1 1.86.16 2.8.16 12.15 0 22-9.85 22-22S44.15 6 32 6Z"
        className="fill-zinc-900 dark:fill-zinc-50"
        opacity="0.14"
      />
      <path
        d="M32 10c-9.94 0-18 8.06-18 18 0 7.3 4.33 13.58 10.58 16.4L22 54l9.76-5.4c.08 0 .16 0 .24 0 9.94 0 18-8.06 18-18S41.94 10 32 10Z"
        className="fill-zinc-900 dark:fill-zinc-50"
      />
      <path
        d="M26.25 29.5c0-3.72 2.93-6.75 6.55-6.75 3.62 0 6.55 3.03 6.55 6.75 0 3.72-2.93 6.75-6.55 6.75-3.62 0-6.55-3.03-6.55-6.75Z"
        className="fill-white dark:fill-black"
        opacity="0.95"
      />
    </svg>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
        className="fill-current"
      />
    </svg>
  );
}

export function IconDatabase(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3c4.42 0 8 1.34 8 3s-3.58 3-8 3-8-1.34-8-3 3.58-3 8-3Zm8 6v4c0 1.66-3.58 3-8 3s-8-1.34-8-3V9c1.68 1.32 4.74 2 8 2s6.32-.68 8-2Zm0 7v2c0 1.66-3.58 3-8 3s-8-1.34-8-3v-2c1.68 1.32 4.74 2 8 2s6.32-.68 8-2Z"
        className="fill-current"
      />
    </svg>
  );
}

export function IconMessage(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 4h16v12H7.2L4 19.2V4Zm3 4h10v2H7V8Zm0 4h7v2H7v-2Z"
        className="fill-current"
      />
    </svg>
  );
}

export function IconPlug(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 2h2v6h6V2h2v6h3v2h-3v2.5A6.5 6.5 0 0 1 11 19v3H9v-3a6.5 6.5 0 0 1-6-6.5V10H0V8h7V2Z"
        className="fill-current"
      />
    </svg>
  );
}

export function IconActivity(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 13h3l2-7 4 16 2-9h5v-2h-3l-1 5-4-16-2 7H4v2Z"
        className="fill-current"
      />
    </svg>
  );
}
