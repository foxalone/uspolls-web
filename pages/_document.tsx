import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html dir="ltr" lang="en">
      <Head>
        <meta name="theme-color" content="#0a2348" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@450;550;650;750;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
