import type { MetadataRoute } from "next";
import { basePath, site } from "@/config/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Climatização`,
    short_name: site.name,
    description: site.shortDescription,
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#070c18",
    theme_color: "#070c18",
    lang: "pt-BR",
    icons: [
      { src: `${basePath}/brand/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${basePath}/brand/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${basePath}/brand/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
