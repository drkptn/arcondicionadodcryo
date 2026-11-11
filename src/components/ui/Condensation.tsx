import { seeded } from "@/lib/format";
import { cn } from "@/lib/cn";

type CondensationProps = {
  /** Quantidade de gotas. */
  count?: number;
  seed?: number;
  className?: string;
  /** Concentra as gotas no topo (como vidro gelado embaçando de cima para baixo). */
  bias?: "top" | "bottom" | "even";
};

/**
 * Condensação sobre vidro: gotas d'água desenhadas só com gradientes CSS.
 * Determinística (mesma disposição no servidor e no cliente) e puramente decorativa.
 */
export function Condensation({ count = 26, seed = 7, className, bias = "top" }: CondensationProps) {
  const rand = seeded(seed);
  const drops = Array.from({ length: count }, (_, index) => {
    const r = rand();
    const size = 3 + Math.pow(rand(), 2.4) * 13;
    const y = bias === "even" ? rand() : Math.pow(rand(), 1.9);
    return {
      id: index,
      left: 2 + rand() * 96,
      top: (bias === "bottom" ? 1 - y : y) * 92 + 2,
      size,
      stretch: 1 + rand() * 0.28,
      opacity: 0.45 + r * 0.5,
      trail: size > 11 && rand() > 0.45 ? 14 + rand() * 34 : 0,
    };
  });

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]", className)}>
      {/* embaçado suave */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,rgb(234_243_250/0.10),transparent_70%)]" />
      {drops.map((drop) => (
        <span
          key={drop.id}
          className="absolute"
          style={{ left: `${drop.left.toFixed(2)}%`, top: `${drop.top.toFixed(2)}%`, opacity: Number(drop.opacity.toFixed(2)) }}
        >
          {drop.trail > 0 && (
            <span
              className="absolute bottom-1/2 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(to_top,rgb(234_243_250/0.35),transparent)]"
              style={{ height: Math.round(drop.trail) }}
            />
          )}
          <span
            className="block rounded-[50%_50%_50%_50%/42%_42%_58%_58%] shadow-[inset_0_-1px_1px_rgb(255_255_255/0.35),inset_0_1px_1px_rgb(0_0_30/0.25),0_1px_2px_rgb(0_0_30/0.35)]"
            style={{
              width: Number(drop.size.toFixed(1)),
              height: Number((drop.size * drop.stretch).toFixed(1)),
              background:
                "radial-gradient(circle at 32% 26%, rgb(255 255 255 / 0.75) 0, rgb(255 255 255 / 0.12) 34%, transparent 58%), radial-gradient(circle at 68% 78%, rgb(169 200 224 / 0.45), transparent 62%), rgb(169 200 224 / 0.08)",
            }}
          />
        </span>
      ))}
    </div>
  );
}
