import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { AppShell } from "../src/components/AppShell";
import { PRESIDENTIAL_SITE } from "../src/data/presidential2028";
import "../src/styles.css";
import "../src/presidential.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const canonical = `${PRESIDENTIAL_SITE.url}${router.asPath === "/" ? "" : router.asPath.split("?")[0]}`;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={PRESIDENTIAL_SITE.name} />
      </Head>
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
    </>
  );
}
