import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { basePath } from "@/config/site";

export default function NotFound() {
  return (
    <>
      <Header home={false} />
      <main id="conteudo" className="relative grid min-h-[90svh] place-items-center overflow-hidden px-6 py-40 text-center">
        <div aria-hidden className="isotherms pointer-events-none absolute inset-0 opacity-60" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_40%,color-mix(in_srgb,var(--hero-c)_45%,transparent),transparent_70%)]" />
        <div className="relative">
          <p className="eyebrow">Erro 404</p>
          <p aria-hidden className="mt-6 font-display text-[clamp(6rem,24vw,16rem)] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--line-strong)]">
            0°
          </p>
          <h1 className="display-md mt-4">Esta página esfriou demais.</h1>
          <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-muted">
            O endereço não existe ou foi movido. Volte ao início para continuar navegando.
          </p>
          <div className="mt-9 flex justify-center">
            <Button href={`${basePath}/`} trailingIcon="arrowRight">
              Voltar ao início
            </Button>
          </div>
        </div>
      </main>
      <Footer home={false} />
    </>
  );
}
