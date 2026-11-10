import type { ReactNode, SVGProps } from "react";

/**
 * Conjunto de ícones próprio da DCRYO.
 * Grade 24×24, traço 1.5, terminações arredondadas — desenhados para a marca.
 */
const paths = {
  // --- Serviços ------------------------------------------------------------
  split: (
    <>
      <rect x="3" y="5.5" width="18" height="8" rx="2.5" />
      <path d="M6.5 10.5h11" />
      <path d="M7.5 16.5c1 .9 1 1.7 0 2.6M12 16.5c1 .9 1 1.7 0 2.6M16.5 16.5c1 .9 1 1.7 0 2.6" />
    </>
  ),
  inverter: (
    <path d="M2.5 12C3.7 6.5 5.3 6.5 6.5 12S9.3 17.5 10.5 12C11.5 8 12.7 8 13.7 12S15.7 15 16.5 12C17.1 10.2 17.9 10.2 18.5 12S19.8 13 21.5 12" />
  ),
  home: (
    <>
      <path d="M3.5 11.2 12 4.5l8.5 6.7" />
      <path d="M6 9.5V19.5h12V9.5" />
      <path d="M9.2 14.8c1-1.1 1.9-1.1 2.8 0s1.8 1.1 2.8 0" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3.5" width="9.5" height="17" rx="1.2" />
      <path d="M14.5 9.5h4.5v11M3 20.5h18" />
      <path d="M8 7.5h1.2M10.8 7.5H12M8 11h1.2M10.8 11H12M8 14.5h1.2M10.8 14.5H12" />
    </>
  ),
  uninstall: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="2.2" />
      <path d="M6.5 8h11M12 14v6.5M9 17.7l3 3 3-3" />
    </>
  ),
  move: (
    <>
      <rect x="2.5" y="4.5" width="9" height="5" rx="1.4" strokeDasharray="2 1.7" />
      <rect x="12.5" y="14.5" width="9" height="5" rx="1.4" />
      <path d="M7 12.5v1.5a3 3 0 0 0 3 3h0M8.3 15.2l1.9 1.8-1.9 1.8" />
    </>
  ),
  maintenance: (
    <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L4 17l3 3 5.5-5.5a4 4 0 0 0 5.2-5.2l-2.6 2.6-2.2-.6-.6-2.2z" />
  ),
  clean: (
    <>
      <path d="M11 4c3 3.6 5 6.3 5 9a5 5 0 0 1-10 0c0-2.7 2-5.4 5-9z" />
      <path d="M8.5 13.2a2.5 2.5 0 0 0 2.5 2.5M19 3.5v3.5M17.2 5.2h3.6" />
    </>
  ),
  inspect: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.3 15.3 20.5 20.5M8 10.5h5M10.5 8v5" />
    </>
  ),
  guide: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1z" />
    </>
  ),
  // --- Tecnologia ----------------------------------------------------------
  design: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="4" />
      <path d="M3.5 14.5h17M15 10h1.8" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 5-13 14-14 0 9-4 14-12 14" />
      <path d="M5 19l7.5-7.5" />
    </>
  ),
  airflow: (
    <>
      <path d="M3 8h9.5a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 12h14.5a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M3 16h6.5A2.5 2.5 0 1 1 7 18.5" />
    </>
  ),
  thermo: (
    <>
      <path d="M9.5 14.2V5.5a2 2 0 0 1 4 0v8.7a4 4 0 1 1-4 0z" />
      <path d="M11.5 9v7.5M17 6h2.5M17 9.5h1.5M17 13h2.5" />
    </>
  ),
  silence: <path d="M4 9.5v5M8 6.5v11M12 9v6M16 10.8v2.4M20 12h.01" />,
  // --- Processo ------------------------------------------------------------
  chat: (
    <>
      <path d="M5 5h14a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5h-7.5L7 20v-3.5H5A1.5 1.5 0 0 1 3.5 15V6.5A1.5 1.5 0 0 1 5 5z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  room: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.6" />
      <path d="M3.5 12h6.5M10 4.5v4M14 19.5v-4.5h6.5" />
    </>
  ),
  quote: (
    <>
      <path d="M7.5 3.5H14l5 5v10.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19V5a1.5 1.5 0 0 1 1.5-1.5z" />
      <path d="M14 3.5v5h5M9 12.5h6M9 16h3.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M8.7 14.6l2.2 2.2 4.4-4.4" />
    </>
  ),
  // --- Diferenciais --------------------------------------------------------
  person: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c.6-3.8 3.4-6 7-6s6.4 2.2 7 6" />
    </>
  ),
  organize: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" />
      <path d="M13.8 16.6l1.9 1.9 3.6-3.8" />
    </>
  ),
  detail: (
    <>
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5l7 2.8v5.2c0 4.3-2.8 7.4-7 9-4.2-1.6-7-4.7-7-9V6.3z" />
      <path d="M9 12.2l2.2 2.2 3.9-4.1" />
    </>
  ),
  // --- Interface -----------------------------------------------------------
  arrowRight: <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8.5 7H17v8.5" />,
  arrowDown: <path d="M12 4.5v15M6 13.5l6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  expand: <path d="M9 4H4v5M15 4h5v5M20 15v5h-5M4 15v5h5" />,
  chevronLeft: <path d="M14.5 5.5 8 12l6.5 6.5" />,
  chevronRight: <path d="M9.5 5.5 16 12l-6.5 6.5" />,
  chevronDown: <path d="M5.5 9.5 12 16l6.5-6.5" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
      <path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" />
      <path d="M4.2 7.5l7.8 6 7.8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21c4-4.5 6.5-7.8 6.5-11a6.5 6.5 0 0 0-13 0c0 3.2 2.5 6.5 6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  rotate: <path d="M4 12a8 8 0 0 1 14-5.3M18.5 3.2v3.8h-3.8M20 12a8 8 0 0 1-14 5.3M5.5 20.8V17h3.8" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="3.8" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 14.3A8 8 0 1 1 9.7 4a6.3 6.3 0 0 0 10.3 10.3z" />,
  star: (
    <path
      d="M12 3.8l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.7l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z"
      fill="currentColor"
      stroke="none"
    />
  ),
  whatsapp: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z" />
      <path
        d="M9.3 8c-.3 0-.6.1-.8.4-.5.6-.7 1.4-.5 2.3.3 1.3 1.1 2.5 2.3 3.6s2.5 1.6 3.6 1.7c.8 0 1.5-.3 1.9-.9.2-.3.2-.7-.1-.9l-1.4-.9c-.3-.2-.6-.1-.8.1l-.5.6c-.2.2-.5.2-.7.1-.9-.5-1.6-1.2-2.1-2.1-.1-.2-.1-.5.1-.7l.4-.5c.2-.2.2-.5.1-.8l-.7-1.5C9.9 8.1 9.6 8 9.3 8z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.6" />
      <circle cx="12" cy="12" r="3.7" />
      <path d="M16.7 7.3h.01" />
    </>
  ),
  facebook: <path d="M15 4.5h-1.5a3 3 0 0 0-3 3V20M7.5 11.5h7" />,
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3.6" />
      <path d="M10.5 9.5l4.5 2.5-4.5 2.5z" />
    </>
  ),
  tiktok: <path d="M13.5 4v10.5A3.5 3.5 0 1 1 10 11M13.5 4c.3 2.5 1.8 4 4.5 4.3" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
};

export function Icon({ name, size = 24, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
