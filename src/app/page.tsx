import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { About } from "@/components/sections/About";
import { Benefits } from "@/components/sections/Benefits";
import { BudgetSimulator } from "@/components/sections/BudgetSimulator";
import { Contact } from "@/components/sections/Contact";
import { FAQ } from "@/components/sections/FAQ";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { businessJsonLd, faqJsonLd, jsonLdString, websiteJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <Services />
        <ProductShowcase />
        <Process />
        <Gallery />
        <Benefits />
        <BudgetSimulator />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      {[businessJsonLd(), websiteJsonLd(), faqJsonLd()].map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />
      ))}
    </>
  );
}
