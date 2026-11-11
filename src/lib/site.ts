export const SITE_NAME = "VotePulse";
export const SITE_URL = "https://votepulse.site";

export const SITE_TAGLINE = {
  en: "America's Political Pulse",
  es: "El pulso político de Estados Unidos",
  ru: "Политический пульс Америки",
} as const;

export const OG_IMAGE_PATH = "/og.png";
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT = `${SITE_NAME} — ${SITE_TAGLINE.en}`;

export function absoluteUrl(path: string) {
  const normalized = path.split("?")[0]?.split("#")[0] || "/";
  if (normalized === "/" || normalized === "") return `${SITE_URL}/`;
  const withSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return `${SITE_URL}${withSlash.replace(/\/+$/, "")}`;
}
