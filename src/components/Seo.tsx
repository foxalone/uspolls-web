import Head from "next/head";
import { useLanguage, type Language } from "../lib/language";
import {
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  absoluteUrl,
} from "../lib/site";

const OG_LOCALE: Record<Language, string> = {
  en: "en_US",
  es: "es_ES",
  ru: "ru_RU",
};

type SeoProps = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  type?: "website" | "article";
};

export function Seo({ title, description, path, noindex = false, type = "website" }: SeoProps) {
  const { language } = useLanguage();
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonical = absoluteUrl(path);
  const alternates = (Object.keys(OG_LOCALE) as Language[]).filter((code) => code !== language);

  return (
    <Head>
      <title key="title">{fullTitle}</title>
      <meta key="description" name="description" content={description} />
      {noindex ? <meta key="robots" name="robots" content="noindex, nofollow" /> : null}
      {noindex ? null : <link key="canonical" rel="canonical" href={canonical} />}
      {noindex ? null : <meta key="og:type" property="og:type" content={type} />}
      {noindex ? null : <meta key="og:site_name" property="og:site_name" content={SITE_NAME} />}
      {noindex ? null : <meta key="og:title" property="og:title" content={fullTitle} />}
      {noindex ? null : <meta key="og:description" property="og:description" content={description} />}
      {noindex ? null : <meta key="og:url" property="og:url" content={canonical} />}
      {noindex ? null : <meta key="og:image" property="og:image" content={OG_IMAGE_URL} />}
      {noindex ? null : <meta key="og:image:width" property="og:image:width" content={String(OG_IMAGE_WIDTH)} />}
      {noindex ? null : <meta key="og:image:height" property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />}
      {noindex ? null : <meta key="og:image:alt" property="og:image:alt" content={OG_IMAGE_ALT} />}
      {noindex ? null : <meta key="og:locale" property="og:locale" content={OG_LOCALE[language]} />}
      {noindex
        ? null
        : alternates.map((code) => (
          <meta key={`og:locale:alternate:${code}`} property="og:locale:alternate" content={OG_LOCALE[code]} />
        ))}
      {noindex ? null : <meta key="twitter:card" name="twitter:card" content="summary_large_image" />}
      {noindex ? null : <meta key="twitter:title" name="twitter:title" content={fullTitle} />}
      {noindex ? null : <meta key="twitter:description" name="twitter:description" content={description} />}
      {noindex ? null : <meta key="twitter:image" name="twitter:image" content={OG_IMAGE_URL} />}
      {noindex ? null : <meta key="twitter:image:alt" name="twitter:image:alt" content={OG_IMAGE_ALT} />}
    </Head>
  );
}
