import { Logo, LogoWordmark } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/icons";
import { services } from "@/config/content";
import { basePath, navigation, site } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";

const socials: { key: keyof typeof site.social; label: string; icon: IconName }[] = [
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "facebook", label: "Facebook", icon: "facebook" },
  { key: "youtube", label: "YouTube", icon: "youtube" },
  { key: "tiktok", label: "TikTok", icon: "tiktok" },
];

/** Rodapé — sempre em azul-marinho profundo, nos dois temas. */
export function Footer({ home = true }: { home?: boolean }) {
  const href = (id: string) => (home ? `#${id}` : `${basePath}/#${id}`);
  const activeSocials = socials.filter((item) => site.social[item.key]);
  const year = new Date().getFullYear();

  return (
    <footer id="rodape" data-theme="dark" className="relative isolate overflow-hidden bg-deep text-fg">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_80%_0%,rgb(26_63_117/0.35),transparent_70%)]" />
      <div aria-hidden className="isotherms absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_top,#000,transparent_75%)]" />
      <div aria-hidden className="hairline" />

      <div className="container-x pb-10 pt-20 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <a href={home ? "#topo" : `${basePath}/`} aria-label="DCRYO — voltar ao início" className="inline-flex text-fg">
              <Logo size={40} />
            </a>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
              Instalação e manutenção de ar-condicionado com precisão técnica e cuidado em cada detalhe.
            </p>
            {activeSocials.length > 0 && (
              <ul className="mt-7 flex gap-2.5">
                {activeSocials.map((item) => (
                  <li key={item.key}>
                    <a
                      href={site.social[item.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`DCRYO no ${item.label}`}
                      className="grid size-11 place-items-center rounded-full border border-line-strong text-fg-soft transition-[border-color,color,background-color] duration-300 hover:border-accent hover:bg-accent/10 hover:text-fg"
                    >
                      <Icon name={item.icon} size={20} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Rodapé — navegação" className="lg:col-span-2 lg:col-start-6">
            <h2 className="eyebrow">Navegação</h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {navigation.map((item) => (
                <li key={item.id}>
                  <a href={href(item.id)} className="link-line text-fg-soft transition-colors hover:text-fg">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Rodapé — serviços" className="lg:col-span-3">
            <h2 className="eyebrow">Serviços</h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {services.slice(0, 8).map((service) => (
                <li key={service.id}>
                  <a href={href("servicos")} className="link-line text-fg-soft transition-colors hover:text-fg">
                    {service.short}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="eyebrow">Contato</h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="link-line inline-flex items-center gap-2 text-fg-soft transition-colors hover:text-fg">
                  <Icon name="whatsapp" size={18} />
                  {site.phoneDisplay || "WhatsApp"}
                </a>
              </li>
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="link-line break-all text-fg-soft transition-colors hover:text-fg">
                    {site.email}
                  </a>
                </li>
              )}
              {site.serviceArea && <li className="text-muted">{site.serviceArea}</li>}
              {site.hours && <li className="text-muted">{site.hours}</li>}
              <li>
                <a href={href("contato")} className="link-line text-fg-soft transition-colors hover:text-fg">
                  Solicitar orçamento
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* marca d'água */}
        <div aria-hidden className="pointer-events-none mt-16 select-none text-frost/[0.09] md:mt-24">
          <LogoWordmark fluid strokeWidth={0.45} />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-7 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}
            {site.legalName ? ` · ${site.legalName}` : ""}
            {site.cnpj ? ` · CNPJ ${site.cnpj}` : ""}. Todos os direitos reservados.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <a href={`${basePath}/privacidade/`} className="link-line transition-colors hover:text-fg">
                Política de privacidade
              </a>
            </li>
            <li>
              <a href={home ? "#topo" : `${basePath}/`} className="link-line inline-flex items-center gap-1.5 transition-colors hover:text-fg">
                Voltar ao topo
                <Icon name="arrowDown" size={12} className="rotate-180" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
