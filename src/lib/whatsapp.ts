import { site } from "@/config/site";

/**
 * Monta o link do WhatsApp com mensagem pré-preenchida.
 * Sem número configurado, o link abre o WhatsApp para o visitante escolher o contato
 * (nenhum telefone é inventado). Configure NEXT_PUBLIC_WHATSAPP_NUMBER.
 */
export function whatsappUrl(message: string = site.whatsappDefaultMessage) {
  const text = encodeURIComponent(message);
  return site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${text}` : `https://wa.me/?text=${text}`;
}

export const hasWhatsappNumber = Boolean(site.whatsapp);

type Line = [label: string, value: string | number | undefined | null];

/** Formata uma mensagem com título e pares "rótulo: valor", ignorando campos vazios. */
export function composeMessage(title: string, lines: Line[], footer?: string) {
  const body = lines
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
    .map(([label, value]) => `• *${label}:* ${String(value).trim()}`)
    .join("\n");
  return [title, "", body, footer ? `\n${footer}` : ""].join("\n").trim();
}

export function openWhatsapp(message: string) {
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
}
