import type { GetStaticProps } from "next";
import Head from "next/head";
import { PresidentialHome, homeCopy } from "../src/components/PresidentialHome";
import { Seo } from "../src/components/Seo";
import type { PresidentialHome as HomeData } from "../src/lib/home/types";
import { useLanguage } from "../src/lib/language";
import { SITE_NAME, SITE_URL, absoluteUrl } from "../src/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: absoluteUrl("/icons/icon-512.png"),
    },
  ],
};

export default function IndexPage({ home }: { home: HomeData }) {
  const { language } = useLanguage();
  const t = homeCopy(language);

  return (
    <>
      <Seo title={t.title} description={t.description} path="/" />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <PresidentialHome home={home} />
    </>
  );
}

export const getStaticProps: GetStaticProps<{ home: HomeData }> = async () => {
  const { loadPresidentialHome } = await import("../src/lib/home/loadHome");
  const { home, revalidate } = await loadPresidentialHome();
  return { props: { home }, revalidate };
};
