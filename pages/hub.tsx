import type { GetStaticProps } from "next";
import Head from "next/head";
import { PresidentialHub, hubCopy } from "../src/components/PresidentialHub";
import { Seo } from "../src/components/Seo";
import type { PresidentialHub as HubData } from "../src/lib/home/types";
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

export default function HubPage({ hub }: { hub: HubData }) {
  const { language } = useLanguage();
  const t = hubCopy(language);

  return (
    <>
      <Seo title={t.title} description={t.description} path="/hub" />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <PresidentialHub hub={hub} />
    </>
  );
}

export const getStaticProps: GetStaticProps<{ hub: HubData }> = async () => {
  const { loadPresidentialHub } = await import("../src/lib/home/loadHub");
  const { hub, revalidate } = await loadPresidentialHub();
  return { props: { hub }, revalidate };
};
