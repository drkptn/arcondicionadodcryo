import type { NextConfig } from "next";

/**
 * Site estático (HTML/CSS/JS em /out) — hospeda em qualquer lugar:
 * Vercel, Netlify, Cloudflare Pages, GitHub Pages, servidor próprio…
 * Para publicar em subpasta, defina NEXT_PUBLIC_BASE_PATH (ex.: /arcondicionadodcryo).
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
