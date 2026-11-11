import { faq, services } from "@/config/content";
import { site } from "@/config/site";

/** Remove chaves vazias para não publicar campos sem informação real. */
function clean<T extends Record<string, unknown>>(object: T) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== "" && value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0)),
  );
}

/** Dados estruturados (schema.org) — só inclui o que estiver preenchido em src/config/site.ts. */
export function businessJsonLd() {
  return clean({
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "@id": `${site.url}/#empresa`,
    name: site.name,
    legalName: site.legalName,
    description: site.shortDescription,
    url: site.url,
    image: `${site.url}/opengraph-image.png`,
    telephone: site.whatsapp ? `+${site.whatsapp}` : "",
    email: site.email,
    address: site.address ? { "@type": "PostalAddress", streetAddress: site.address, addressCountry: "BR" } : undefined,
    areaServed: site.cities.map((city) => ({ "@type": "City", name: city })),
    sameAs: Object.values(site.social).filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços de climatização",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.title, description: service.description },
      })),
    },
  });
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#site`,
    url: site.url,
    name: site.name,
    inLanguage: "pt-BR",
  };
}

/** Serializa JSON-LD com escape de "<" (evita injeção em <script>). */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
