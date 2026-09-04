import type { AppProps } from "next/app";
import Head from "next/head";
import { AppShell } from "../src/components/AppShell";
import "../src/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
    </>
  );
}
