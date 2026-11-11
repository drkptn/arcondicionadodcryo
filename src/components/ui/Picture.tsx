import manifest from "@/config/images.generated.json";
import { asset } from "@/config/site";
import { cn } from "@/lib/cn";

type Entry = { width: number; height: number; widths: number[]; alpha: boolean; blur: string | null };
const images = manifest as Record<string, Entry>;

type PictureProps = {
  /** Nome do arquivo em public/images (sem extensão/largura). */
  name: string;
  alt: string;
  /** Atributo sizes — largura ocupada pela imagem em cada breakpoint. */
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

/** Imagem responsiva (AVIF + WebP) com placeholder desfocado, gerada por `npm run images`. */
export function Picture({ name, alt, sizes, className, imgClassName, priority = false }: PictureProps) {
  const entry = images[name];
  if (!entry) {
    return <div role="img" aria-label={alt} className={cn("bg-surface-2", className)} />;
  }
  const srcSet = (ext: string) => entry.widths.map((w) => `${asset(`/images/${name}-${w}.${ext}`)} ${w}w`).join(", ");
  const fallback = entry.widths[Math.min(2, entry.widths.length - 1)];
  return (
    <picture className={cn("block", className)}>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={asset(`/images/${name}-${fallback}.webp`)}
        alt={alt}
        width={entry.width}
        height={entry.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={cn("size-full object-cover", imgClassName)}
        style={entry.blur ? { backgroundImage: `url(${entry.blur})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      />
    </picture>
  );
}

export const imageMeta = (name: string) => images[name];
