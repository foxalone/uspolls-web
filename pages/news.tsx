import Head from "next/head";
import { HomeBuzz } from "../src/components/HomeBuzz";
import { HomeHeadlines } from "../src/components/HomeHeadlines";
import { HomeNews } from "../src/components/HomeNews";
import { SITE } from "../src/data/midterms2026";

export default function NewsPage() {
  const title = `News and headlines ${SITE.year} — US Polls`;
  const description = "Campaign headlines, buzz, and the latest coverage of the 2026 House and Senate midterms.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <div className="home-stack">
        <HomeHeadlines />
        <HomeBuzz />
        <HomeNews />
      </div>
    </>
  );
}
