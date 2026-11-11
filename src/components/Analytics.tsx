import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";
const GA_ENABLED = /^G-[A-Z0-9]+$/.test(GA_ID);

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

export function Analytics() {
  const router = useRouter();

  useEffect(() => {
    if (!GA_ENABLED) return;
    const onRoute = (url: string) => {
      (window as GtagWindow).gtag?.("config", GA_ID, { page_path: url });
    };
    router.events.on("routeChangeComplete", onRoute);
    return () => router.events.off("routeChangeComplete", onRoute);
  }, [router.events]);

  if (!GA_ENABLED) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
