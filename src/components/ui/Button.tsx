"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "glass" | "whatsapp" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
  type?: "button" | "submit";
  icon?: IconName;
  /** Ícone à direita que desliza no hover. */
  trailingIcon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  /** Atração magnética ao cursor (desktop). */
  magnetic?: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  "aria-label"?: string;
  "data-cursor"?: string;
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.8125rem] gap-2",
  md: "h-12 px-6 text-sm gap-2.5",
  lg: "h-14 px-7 text-[0.9375rem] gap-3",
};

const variants: Record<Variant, string> = {
  primary:
    "text-frost bg-(image:--btn-primary) shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_14px_34px_-14px_rgb(26_63_117/0.9)]",
  secondary:
    "text-fg border border-line-strong bg-transparent hover:border-accent/70",
  glass: "text-fg glass",
  whatsapp:
    "text-white bg-[linear-gradient(135deg,#1a9460_0%,#127248_100%)] shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_14px_34px_-16px_rgb(18_114_72/0.9)]",
  ghost: "text-fg-soft hover:text-fg",
};

/**
 * Botão da DCRYO: magnético, com brilho que varre no hover e estados de
 * foco, pressionado, carregando e desabilitado.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  external,
  type = "button",
  icon,
  trailingIcon,
  loading = false,
  disabled = false,
  magnetic = true,
  className,
  onClick,
  ...rest
}: ButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const inactive = disabled || loading;

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!magnetic || inactive || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.22);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "group/btn relative inline-flex select-none items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.01em] whitespace-nowrap",
    "transition-[border-color,box-shadow,opacity,color] duration-500 ease-out-expo active:scale-[0.97]",
    sizes[size],
    variants[variant],
    inactive && "pointer-events-none opacity-55",
    className,
  );

  const content = (
    <>
      {(variant === "primary" || variant === "whatsapp") && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 blur-md transition-all duration-700 ease-out-expo group-hover/btn:left-[110%] group-hover/btn:opacity-100"
        />
      )}
      {(variant === "secondary" || variant === "glass") && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 rounded-full bg-accent/12 transition-transform duration-500 ease-out-expo group-hover/btn:scale-y-100"
        />
      )}
      {loading ? (
        <span aria-hidden className="relative size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : (
        icon && <Icon name={icon} size={size === "sm" ? 16 : 18} className="relative shrink-0" />
      )}
      <span className="relative">{children}</span>
      {trailingIcon && !loading && (
        <span aria-hidden className="relative grid size-[1.1em] shrink-0 overflow-hidden">
          <Icon
            name={trailingIcon}
            size={18}
            className="col-start-1 row-start-1 size-full transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-[130%]"
          />
          <Icon
            name={trailingIcon}
            size={18}
            className="col-start-1 row-start-1 size-full -translate-x-[130%] transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0"
          />
        </span>
      )}
    </>
  );

  const shared = {
    className: classes,
    style: { x: sx, y: sy },
    onPointerMove,
    onPointerLeave: reset,
    onClick,
    "aria-busy": loading || undefined,
    ...rest,
  };

  if (href) {
    return (
      <motion.a
        ref={(node) => {
          ref.current = node;
        }}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-disabled={inactive || undefined}
        tabIndex={inactive ? -1 : undefined}
        {...shared}
      >
        {content}
      </motion.a>
    );
  }
  return (
    <motion.button
      ref={(node) => {
        ref.current = node;
      }}
      type={type}
      disabled={inactive}
      {...shared}
    >
      {content}
    </motion.button>
  );
}
