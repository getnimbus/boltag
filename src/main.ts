import "@webcomponents/webcomponentsjs/webcomponents-bundle.js";
import * as Sentry from "@sentry/svelte";
import WebApp from "@twa-dev/sdk";
import mixpanel from "mixpanel-browser";
import { isNimbusVersion } from "./utils/constants";

import App from "./App.svelte";

const MIXPANEL_KEY = isNimbusVersion ? "d56364b743cd70634fe5bea51e1d7e1c" : "fa49c00f14cf85adf213f10911662b28"

mixpanel.init(MIXPANEL_KEY, {
  debug: false,
  ignore_dnt: true,
});

WebApp.ready();

Sentry.init({
  dsn: "https://314310ebdb5bff4a14a386f1eb6d47b2@o4505729367801856.ingest.us.sentry.io/4506455493246976",
  integrations: [Sentry.browserTracingIntegration()],
  // debug: true,
  release: "v1.0.0", // TODO: Update version here
  tracePropagationTargets: ["localhost"],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0,
  sampleRate: 0.1,
});

const app = new App({
  target: document.getElementById("app"),
});

let isInitedTonAnalytics = false;
const initTonAnalytics = () => {
  if (window?.telegramAnalytics) {
    isInitedTonAnalytics = true;
    window.telegramAnalytics.init({
      token: 'eyJhcHBfbmFtZSI6Im5pbWJ1c2JvdCIsImFwcF91cmwiOiJodHRwcy8vdC5tZS9HZXROaW1idXNCb3QiLCJhcHBfZG9tYWluIjoiaHR0cHM6Ly9hcHAuZ2V0bmltYnVzLmlvIn0=!greHqwmn7mYk1Xf6cT4UJRc9poFOpabg8N8QW7qEUVk=',
      appName: 'GetNimbusTWA',
    });

    return;
  }

  setTimeout(() => {
    initTonAnalytics();
  }, 500);
}

initTonAnalytics();

export default app
