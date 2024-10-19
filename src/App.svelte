<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { onMount, onDestroy } from "svelte";
  import { Route, Router } from "svelte-navigator";
  import * as browser from "webextension-polyfill";
  import {
    user,
    isDarkMode,
    isAutoDarkMode,
    tonConnector,
    userPublicAddress,
    userId,
    selectedPackage,
    isTWA,
  } from "~/store";
  import { TonConnectUI } from "@tonconnect/ui";
  import { internalNimbus, userAPICreate } from "./lib/network";
  import mixpanel from "mixpanel-browser";
  import { THEME } from "@tonconnect/ui";
  import SvelteSeo from "svelte-seo";

  import "flowbite/dist/flowbite.css";

  import ErrorBoundary from "~/components/ErrorBoundary.svelte";
  import UpdateParams from "~/components/UpdateParams.svelte";
  import Footer from "~/UI/Footer/Footer.svelte";
  import LoadingPremium from "~/components/LoadingPremium.svelte";
  import ToastProvider from "~/provider/ToastProvider.svelte";
  import BonusProvider from "~/provider/BonusProvider.svelte";
  import SafeAppProvider from "~/provider/SafeAppProvider.svelte";
  import "~/components/Tooltip.custom.svelte";

  import User from "~/assets/user.png";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      },
    },
  });

  let isTouchDevice = false;

  $: {
    browser.storage.onChanged.addListener((changes) => {
      if (changes?.options?.newValue?.lang) {
        window.location.reload();
      }
    });
  }

  $: {
    window
      .matchMedia("(prefers-color-scheme:dark)")
      .addEventListener("change", (e) => {
        if ($isAutoDarkMode) {
          checkSystemTheme(true);
        }
      });
  }

  const checkSystemTheme = (condition: boolean) => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if ($isAutoDarkMode || condition) {
      if (isDark) {
        window.document.body.classList.add("dark");
        isDarkMode.update((n) => (n = true));
        localStorage.setItem("theme", "dark");
      } else {
        window.document.body.classList.remove("dark");
        isDarkMode.update((n) => (n = false));
        localStorage.setItem("theme", "light");
      }
    }
  };

  const interval = setInterval(checkSystemTheme, 60000);

  const parseQueryString = (queryString: any) => {
    const params = new URLSearchParams(queryString);
    const result: any = {};

    for (const [key, value] of params.entries()) {
      if (key === "user") {
        result[key] = JSON.parse(decodeURIComponent(value));
      } else {
        result[key] = value;
      }
    }

    return result;
  };

  const handleSetUserData = (data: any, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("public_address", data?.publicAddress);
    userPublicAddress.update((n) => (n = data?.publicAddress));
    userId.update((n) => (n = data?.id));
    // selectedPackage.update((n) => (n = data?.plan?.tier.toUpperCase()));
    selectedPackage.update((n) => "PROFESSIONAL"); // NOTICE: THIS ONE IS HARD CODE
    mixpanel.identify(data?.id);
    user.update(
      (n) =>
        (n = {
          picture: User,
        }),
    );
    queryClient.invalidateQueries(["list-address"]);
  };

  const handleGetTeleToken = async (
    id: number,
    teleUsername: string,
    invitation: string,
  ) => {
    if (id !== 0 && teleUsername) {
      try {
        const result = await internalNimbus
          .post("/internal/v2/users/login-tg", {
            chatId: id.toString(),
            userId: id.toString(),
            username: teleUsername,
            referrer: invitation.length !== 0 ? invitation : undefined,
          })
          .then((res) => res?.data?.data)
          .catch((error) => {
            console.error(error);
            return { token: "", owner: "" };
          });

        if (result && result?.token?.length !== 0) {
          const { api, owner } = await userAPICreate(
            result?.token,
            result?.owner,
          );
          const userInfo = await api.get("/users/me").then((res) => res.data);
          if (userInfo) {
            handleSetUserData(userInfo, result?.token);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  onMount(() => {
    if (localStorage.auto_theme === "true") {
      isAutoDarkMode.update((n) => (n = true));
      checkSystemTheme(true);
    } else {
      isAutoDarkMode.update((n) => (n = false));
      checkSystemTheme(false);
    }

    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      window.document.body.classList.add("dark");
      isDarkMode.update((n) => (n = true));
    } else {
      window.document.body.classList.remove("dark");
      isDarkMode.update((n) => (n = false));
    }

    // TMA init
    if (window.Telegram?.WebApp && window.Telegram?.WebApp?.initData) {
      isTWA.update((n) => (n = true));
      const twaTheme = window.Telegram.WebApp?.colorScheme;
      window.Telegram.WebApp.isClosingConfirmationEnabled = true;
      if (twaTheme === "dark") {
        window.document.body.classList.add("dark");
        isDarkMode.update((n) => (n = true));
      } else {
        window.document.body.classList.remove("dark");
        isDarkMode.update((n) => (n = false));
      }

      window.Telegram.WebApp.expand();
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash);
      const initDataRaw = params.get("tgWebAppData");
      const initData = parseQueryString(initDataRaw);
      const teleUserId = Number(initData?.user?.id || 0);
      const teleUsername = initData?.user?.username || "";
      const invitation = initData?.start_param || "";

      if (
        teleUserId &&
        teleUserId !== 0 &&
        teleUsername &&
        teleUsername.length !== 0
      ) {
        handleGetTeleToken(teleUserId, teleUsername, invitation);
      }
    }

    // Check for touch device
    if ("ontouchstart" in window || navigator.maxTouchPoints) {
      isTouchDevice = true;
    }

    const introduce = localStorage.getItem("blockShowMobileIntro");
    if (introduce === "false" || introduce === null) {
      localStorage.setItem("blockShowMobileIntro", "false");
    }

    const tonInstance = new TonConnectUI({
      manifestUrl:
        "https://gist.githubusercontent.com/toannhu96/0f9cdecbfa668157a901c76f41ced0f0/raw/78bdaee6e4f101032bb97cfece71b79b7f28fbd5/tonconnect-manifest.json",
      uiPreferences: {
        theme: $isDarkMode ? THEME.DARK : THEME.LIGHT,
      },
    });
    tonConnector.update((n) => (n = tonInstance));
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  // Remove the loading screen after the app has been initialized
  document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }
  });
</script>

<svelte:head>
  <script>
    !(function (e, t) {
      const a = "featurebase-sdk";
      function n() {
        if (!t.getElementById(a)) {
          var e = t.createElement("script");
          (e.id = a),
            (e.src = "https://do.featurebase.app/js/sdk.js"),
            t
              .getElementsByTagName("script")[0]
              .parentNode.insertBefore(e, t.getElementsByTagName("script")[0]);
        }
      }
      "function" != typeof e.Featurebase &&
        (e.Featurebase = function () {
          (e.Featurebase.q = e.Featurebase.q || []).push(arguments);
        }),
        "complete" === t.readyState || "interactive" === t.readyState
          ? n()
          : t.addEventListener("DOMContentLoaded", n);
    })(window, document);

    Featurebase("initialize_changelog_widget", {
      organization: window.isWhiteLabel ? "cryptotaxprep" : "nimbus",
      placement: "bottom",
      theme: "light",
      initialPage: "MainView",
      fullscreenPopup: true,
      // fullScreen: false,
    });
  </script>
  <script>
    Featurebase("initialize_feedback_widget", {
      organization: window.isWhiteLabel ? "cryptotaxprep" : "nimbus", // required
      theme: "light", // required
      // placement: "right", // optional
      // email: "youruser@example.com", // optional
    });
  </script>

  <link
    rel="icon"
    type="image/svg+xml"
    href="https://getnimbus.io/nimbusFavicon.svg"
  />
  <meta
    property="og:image"
    content="https://getnimbus.io/images/hero/opengraph-img.png"
  />
</svelte:head>

<SvelteSeo
  title="Nimbus - Your Personalized Portfolio"
  description="Multiple platforms portfolio tracking with metrics tailored for investors"
  keywords="web3 portfolio for tracking crypto, crypto portfolio trackers, web3 portfolio website, web3 trading, defi portfolio tracking, tracking crypto portfolio, portfolio tracker for crypto, multichain portfolio tracker, online crypto portfolio tracker, portfolio tracker crypto and stocks, best crypto portfolio tracking app, portfolio tracking crypto, uniswap portfolio tracker, What is nimbus, nimbus blog, invest with nimbus, nimbus tools, tools for invest, How to invest bitcoin, how to make money with bitcoin, tools helping invest bitcoin, What is portfolio, how to make portfolio for invest, portfolio invest, What is nimbus, what is nimbus web3, nimbus, getnimbus, nimbus portfolio, why is nimbus, invest with nimbus, invest tools, web3 portfolio, web3 nimbus, web3 portfolio, web3 portfolio management, portfolio management, What is an investment, how to invest, Wherever you invest, you will have a lot of money, which platform is good for investment, what is investing crypto, how to invest crypto, how to invest, tool for investment, invest tools, top tools for investing, how to invest, crypto investment, crypto trading, tools for helping trading, make money with crypto but low cost, make money but don’t want to loss money, Crypto tracking, how to track crypto, how to update crypto info, how to track crypto, how to know my crypto is lost, tracking crypto profit, crypto tracking notification, whale tracking, whale crypto reading, whale crypto tracking, tracking whale crypto, What is blockchain, what is block, what is crypto, what should i know about crypto, what i should know about blockchain, make money with blockchain, make money with crypto, how to make money with crypto, how to make money with blockchain"
  twitter={{
    card: "summary_large_image",
    site: "@get_nimbus",
    title: "Nimbus - Your Personalized Portfolio",
    description:
      "Multiple platforms portfolio tracking with metrics tailored for investors",
    image: "https://getnimbus.io/images/hero/opengraph-img.png",
    imageAlt: "Nimbus",
  }}
/>

<ErrorBoundary>
  <SafeAppProvider let:safeAppsSdk>
    <ToastProvider>
      <BonusProvider>
        <QueryClientProvider client={queryClient}>
          <Router history={undefined}>
            <Route path="*">
              {#await import("~/layouts/Swap.svelte")}
                <div class="flex items-center justify-center h-screen">
                  <LoadingPremium />
                </div>
              {:then { default: component }}
                <svelte:component this={component} />
              {:catch error}
                {@html Error(error)}
              {/await}
            </Route>

            <div class="footer fixed bottom-0 left-0 z-8 w-full xl:relative">
              <Footer />
            </div>
          </Router>
        </QueryClientProvider>
      </BonusProvider>
    </ToastProvider>
  </SafeAppProvider>
</ErrorBoundary>

<style global>
  :root {
    --onboard-modal-z-index: 2147483648;
  }

  [type="text"]:focus,
  [type="email"]:focus,
  [type="url"]:focus,
  [type="password"]:focus,
  [type="number"]:focus,
  [type="date"]:focus,
  [type="datetime-local"]:focus,
  [type="month"]:focus,
  [type="search"]:focus,
  [type="tel"]:focus,
  [type="time"]:focus,
  [type="week"]:focus,
  [multiple]:focus,
  textarea:focus,
  select:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  :global(body) {
    background: #fff;
    color: black;
    transition: background-color 0.3s;
  }
  :global(body.dark) {
    background-color: #161616;
    color: #fff;
  }

  :global(body) .footer {
    background: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 40px;
  }
  :global(body.dark) .footer {
    background: #202020;
    box-shadow: rgba(0, 0, 0, 1) 0px 0px 5px;
  }

  :global(body) .bg_f4f5f8 {
    background: #f4f5f8;
  }
  :global(body.dark) .bg_f4f5f8 {
    background: #131313;
  }

  :global(body) .bg_fafafbff {
    background: #fafafbff;
  }
  :global(body.dark) .bg_fafafbff {
    background: #212121;
  }

  :global(body) .text_00000080 {
    color: #00000080;
  }
  :global(body.dark) .text_00000080 {
    color: #d1d5db;
  }

  :global(body) .text_27326F {
    color: #27326f;
  }
  :global(body.dark) .text_27326F {
    color: #3b82f6;
  }

  :global(body) .text_00000099 {
    color: #00000099;
  }
  :global(body.dark) .text_00000099 {
    color: #ccc;
  }

  :global(body) .text_00000066 {
    color: #00000099;
  }
  :global(body.dark) .text_00000066 {
    color: #cdcdcd;
  }

  :global(body) .border_0000001a {
    border-color: #0000001a;
  }
  :global(body.dark) .border_0000001a {
    border-color: #cdcdcd59;
  }

  :global(body) .border_0000000d {
    border-color: #0000000d;
  }
  :global(body.dark) .border_0000000d {
    border-color: #cdcdcd26;
  }

  @media (max-width: 1024px) {
    #mava {
      display: none !important;
    }

    .fb-feedback-widget-feedback-button-container {
      display: none !important;
    }
  }

  :global(body) .driver-popover {
    /* border-radius: 10px; */
    border-radius: 12px;
    padding: 18px 26px 18px 26px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  :global(body) .driver-popover-prev-btn,
  :global(body) .driver-popover-next-btn {
    border-radius: 12px;
    padding: 8px 16px 8px 16px;
    background-color: #1e96fc;
    color: white;
    text-shadow: none;
    border: none;
  }

  :global(body) .driver-popover-prev-btn:hover,
  :global(body) .driver-popover-next-btn:hover {
    background-color: #4fadfd;
  }

  :global(body) .driver-popover-footer {
    gap: 25px;
  }

  :global(body) .driver-popover-close-btn {
    width: 30px;
    height: 30px;
    font-size: 25px;
    color: #6b7280;
  }
</style>
