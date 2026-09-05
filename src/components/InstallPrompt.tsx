import { useEffect, useState } from "react";
import {
  clearDeferredInstall,
  dismissPwaPrompt,
  getDeferredInstall,
  isIosDevice,
  isStandaloneDisplay,
  registerServiceWorker,
  wasPwaPromptDismissed,
} from "../lib/pwa";

type PromptMode = "native" | "ios" | null;

export function InstallPrompt() {
  const [mode, setMode] = useState<PromptMode>(null);

  useEffect(() => {
    void registerServiceWorker();

    const canShow = () => !isStandaloneDisplay() && !wasPwaPromptDismissed();

    const showNative = () => {
      if (canShow() && getDeferredInstall()) {
        setMode("native");
      }
    };

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      window.__pwaInstall = event as Window["__pwaInstall"];
      showNative();
    };

    const showIos = () => {
      if (!canShow() || getDeferredInstall()) {
        return;
      }
      if (isIosDevice()) {
        setMode("ios");
      }
    };

    showNative();
    showIos();
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("uspolls-pwa-available", showNative);
    const poll = window.setInterval(showNative, 400);
    const iosTimer = window.setTimeout(showIos, 600);
    const stopPoll = window.setTimeout(() => window.clearInterval(poll), 12000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("uspolls-pwa-available", showNative);
      window.clearInterval(poll);
      window.clearTimeout(iosTimer);
      window.clearTimeout(stopPoll);
    };
  }, []);

  if (!mode) {
    return null;
  }

  const close = () => {
    dismissPwaPrompt();
    setMode(null);
  };

  const install = async () => {
    const deferred = getDeferredInstall();
    if (!deferred) {
      close();
      return;
    }
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      clearDeferredInstall();
      if (choice.outcome === "accepted") {
        setMode(null);
        return;
      }
    } catch {
      // user closed the browser sheet
    }
    close();
  };

  return (
    <aside className="pwa-install" role="dialog" aria-label="Install US Polls">
      <span className="pwa-install__mark" aria-hidden="true">
        US
      </span>
      <div className="pwa-install__copy">
        <strong>Install US Polls</strong>
        {mode === "ios" ? (
          <p>
            Tap <b>Share</b>, then <b>Add to Home Screen</b>.
          </p>
        ) : (
          <p>Add the midterm monitor to your phone.</p>
        )}
      </div>
      {mode === "native" ? (
        <button className="pwa-install__action" onClick={() => void install()} type="button">
          Install
        </button>
      ) : null}
      <button aria-label="Dismiss install prompt" className="pwa-install__close" onClick={close} type="button">
        ×
      </button>
    </aside>
  );
}
