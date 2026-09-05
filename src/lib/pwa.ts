export const PWA_PROMPT_KEY = "uspolls-pwa-prompt";
export const PWA_HIDE_MS = 21 * 24 * 60 * 60 * 1000;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    __pwaInstall?: BeforeInstallPromptEvent | null;
  }
}

export function isStandaloneDisplay(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function isIosDevice(): boolean {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) {
    return true;
  }
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

export function wasPwaPromptDismissed(): boolean {
  try {
    const raw = localStorage.getItem(PWA_PROMPT_KEY);
    if (!raw) {
      return false;
    }
    const saved = Number(raw);
    return Number.isFinite(saved) && Date.now() - saved < PWA_HIDE_MS;
  } catch {
    return false;
  }
}

export function dismissPwaPrompt() {
  try {
    localStorage.setItem(PWA_PROMPT_KEY, String(Date.now()));
  } catch {
    // ignore quota / private mode
  }
}

export function getDeferredInstall(): BeforeInstallPromptEvent | null {
  return window.__pwaInstall ?? null;
}

export function clearDeferredInstall() {
  window.__pwaInstall = null;
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  try {
    await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  } catch {
    // installability still works from the manifest on supporting browsers
  }
}
