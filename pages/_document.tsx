import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html dir="ltr" lang="en">
      <Head>
        <meta name="theme-color" content="#041024" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@450;550;650;750;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="uspolls-theme";var p=localStorage.getItem(k);if(p!=="light"&&p!=="dark"&&p!=="auto")p="auto";var d=p==="dark"||(p==="auto"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var t=d?"dark":"light";var r=document.documentElement;r.dataset.themePref=p;r.dataset.theme=t;r.style.colorScheme=t;}catch(e){document.documentElement.dataset.theme="dark";document.documentElement.dataset.themePref="auto";}})();`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
