import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Preloader } from "@/components/layout/Preloader";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Providers } from "@/components/providers/Providers";
import { themeInitScript } from "@/components/providers/ThemeProvider";
import { site } from "@/config/site";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: ["400", "500"] });

const title = "DCRYO — Instalação de ar-condicionado e climatização";
const description =
  "Instalação de ar-condicionado Split e Inverter para residências e empresas. Avaliação técnica, orçamento transparente e acabamento cuidadoso. Solicite seu orçamento.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s · DCRYO" },
  description,
  applicationName: site.name,
  keywords: [
    "instalação de ar-condicionado",
    "instalação de ar-condicionado split",
    "instalação de ar-condicionado inverter",
    "instalação de ar-condicionado residencial",
    "instalação de ar-condicionado comercial",
    "climatização de ambientes",
    "orçamento instalação ar-condicionado",
    "manutenção de ar-condicionado",
    "higienização de ar-condicionado",
    ...site.cities.map((city) => `instalação de ar-condicionado em ${city}`),
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070c18" },
    { media: "(prefers-color-scheme: light)", color: "#070c18" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      suppressHydrationWarning
      className={`${manrope.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <noscript>
          <style>{`.preloader{display:none!important}[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <Preloader />
        <Providers>
          <ScrollProgress />
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
