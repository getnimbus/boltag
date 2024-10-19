<script lang="ts">
  import mixpanel from "mixpanel-browser";
  import { nimbus } from "~/lib/network";
  import { createQuery } from "@tanstack/svelte-query";
  import { onDestroy, onMount } from "svelte";
  import { t } from "~/lib/i18n";
  import {
    HiddenUI,
    NimbusSwapWidget,
    type Route,
    type WidgetConfig,
    WidgetEvent,
    widgetEvents,
  } from "nimbus-universal-swap";
  import { useQueryClient } from "@tanstack/svelte-query";
  import {
    tonConnector,
    isDarkMode,
    typeWallet,
    userPublicAddress,
    wallet,
    user,
    chain,
  } from "~/store";
  import { triggerBonusScore, triggerToast } from "~/utils/functions";
  import numeral from "numeral";
  import { wait } from "~/utils";
  import { Motion } from "svelte-motion";

  import AppOverlay from "~/components/Overlay.svelte";
  import ErrorBoundary from "~/components/ErrorBoundary.svelte";
  import ReactAdapter from "~/components/ReactAdapter.svelte";
  import LoadingPremium from "~/components/LoadingPremium.svelte";

  enum ChainType {
    EVM = "EVM",
    SVM = "SVM",
    TVM = "TVM",
    MVM = "MVM",
  }

  enum ChainId {
    TON = 2251111081099710,
    MOVE = 3342222192100821,
    SOL = 1151111081099710,
  }

  const queryClient = useQueryClient();

  let swapChangePage = "";
  let isShowChart = false;
  let addressChart = "0x2::sui::SUI";
  let refAddressParam = "";

  onMount(() => {
    const showCandleChartSwapStorage = localStorage.getItem(
      "showCandleChartSwap",
    );
    const refAddressSwapStorage = localStorage.getItem("refAddressSwap");

    if (refAddressSwapStorage) {
      refAddressParam = refAddressSwapStorage;
    }

    if (showCandleChartSwapStorage) {
      isShowChart = showCandleChartSwapStorage === "true";
    }
  });

  const listNativeToken = [
    "0x2::sui::SUI",
    "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
    "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
    "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN",
  ];

  const handleChangeAddressChart = () => {
    if (
      listNativeToken.includes(paramsTokenInfo.fromToken) &&
      listNativeToken.includes(paramsTokenInfo.toToken)
    ) {
      addressChart = "0x2::sui::SUI";
    } else if (listNativeToken.includes(paramsTokenInfo.fromToken)) {
      addressChart = paramsTokenInfo.toToken;
    } else if (listNativeToken.includes(paramsTokenInfo.toToken)) {
      addressChart = paramsTokenInfo.fromToken;
    } else {
      addressChart = paramsTokenInfo.toToken;
    }
  };

  let widgetConfig = {};

  const defaultWidgetConfig: WidgetConfig = {
    appearance: $isDarkMode ? "dark" : "light",
    theme: {
      palette: {
        background: {
          default: $isDarkMode ? "#0f0f0f" : "#fff",
        },
        primary: {
          main: "#1e96fc",
        },
      },
      typography: {
        fontFamily: "Golos Text",
      },
      container: {
        height: "auto",
        width: "auto",
        padding: "0",
        borderRadius: "20px",
      },
    },
    integrator: "Nimbus",
    hiddenUI: [
      HiddenUI.ToAddress,
      HiddenUI.Language,
      HiddenUI.Appearance,
      HiddenUI.History,
    ],
    brandingLogo: "https://getnimbus.io/nimbusFavicon.svg",
    variant: "compact",
    subvariant: "split",
    subvariantOptions: {
      split: "swap",
    },
    chains: {
      types: {
        allow: [ChainType.MVM],
        deny: [ChainType.SVM, ChainType.EVM, ChainType.TVM],
      },
    },
    commissionBps: {
      [ChainId.MOVE]: 0,
    },
    commissionBpsSDK: {
      [ChainId.MOVE]: 0,
    },
    tonConnectUI: $tonConnector!,
    sdkConfig: {
      rpcUrls: {
        [ChainId.SOL]: [
          "https://rpc-aggregator.service.getnimbus.io/solana_das?key=28ad52be-5b89-4c0a-8ce9-e053c053466b",
        ],
      },
    },
  };

  $: {
    if ($isDarkMode) {
      widgetConfig = {
        ...defaultWidgetConfig,
        appearance: "dark",
        theme: {
          ...defaultWidgetConfig.theme,
          palette: {
            ...defaultWidgetConfig.theme?.palette,
            background: {
              default: "#0f0f0f",
            },
          },
        },
      };
    } else {
      widgetConfig = {
        ...defaultWidgetConfig,
        appearance: "light",
        theme: {
          ...defaultWidgetConfig.theme,
          palette: {
            ...defaultWidgetConfig.theme?.palette,
            background: {
              default: "#fff",
            },
          },
        },
      };
    }
  }

  // const getSwapReward = async () => {
  //   return await nimbus
  //     .get("/onchain/rewards?chain=ALL")
  //     .then((res: any) => res.data);
  // };

  // let swapReward: any = [];
  // let isOpenModal = false;

  // $: querySwapReward = createQuery({
  //   queryKey: ["swap-reward", $wallet],
  //   queryFn: () => getSwapReward(),
  //   retry: false,
  // });

  // $: {
  //   if (!$querySwapReward.isError && $querySwapReward.data !== undefined) {
  //     swapReward = $querySwapReward?.data?.map((item: any) => {
  //       if (item.type === "GM_POINT") {
  //         return {
  //           ...item,
  //           symbol: "GM POINT",
  //         };
  //       }
  //       return item;
  //     });
  //   }
  // }

  // const handleFormatIdBlockChain = (id: number) => {
  //   switch (id) {
  //     case 1:
  //       return "ETH";
  //     case 42161:
  //       return "ARB";
  //     case 10:
  //       return "OP";
  //     case 137:
  //       return "MATIC";
  //     case 56:
  //       return "BNB";
  //     case 324:
  //       return "ZKSYNC";
  //     case 8453:
  //       return "BASE";
  //     case 43114:
  //       return "AVAX";
  //     case 1101:
  //       return "POLYGON_ZKEVM";
  //     case 59144:
  //       return "LINEA";
  //     case 100:
  //       return "XDAI";
  //     case 250:
  //       return "FANTOM";
  //     case 1285:
  //       return "MOVR";
  //     case 1284:
  //       return "GLMR";
  //     case 1313161554:
  //       return "AURORA";
  //     case 1088:
  //       return "METIS";
  //     case ChainId.SOL:
  //       return "SOL";
  //     case ChainId.MOVE:
  //       return "SUI";
  //     case ChainId.TON:
  //       return "TON";
  //     default:
  //       return "";
  //   }
  // };

  // const forceRefreshHoldingToken = async (
  //   address: string,
  //   selectedChain: string,
  // ) => {
  //   try {
  //     await nimbus.get(
  //       `/v2/address/${address}/holding?chain=${selectedChain}&force_refresh=${true}`,
  //       {
  //         headers: {
  //           "Cache-Control": "no-cache",
  //         },
  //       },
  //     );
  //     if ($chain !== "ALL") {
  //       queryClient?.invalidateQueries(["token-holding-each-chain"]);
  //     } else {
  //       queryClient?.invalidateQueries(["token-holding"]);
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // const updateBalanceToken = async (data: any) => {
  //   try {
  //     const payload = [
  //       {
  //         chain: handleFormatIdBlockChain(data.fromChainId),
  //         owner: $userPublicAddress,
  //         contract_address: data?.fromAddress || data?.fromToken?.address,
  //       },
  //       {
  //         chain: handleFormatIdBlockChain(data.toChainId),
  //         owner: $userPublicAddress,
  //         contract_address: data?.toAddress || data?.toToken?.address,
  //       },
  //     ];
  //     await nimbus.post("/v2/holding-realtime", payload);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // const triggerFireworkBonus = (score: number) => {
  //   triggerBonusScore(score, 1000);
  // };

  // const tradeLog = async (data: any) => {
  //   try {
  //     const response: any = await nimbus.post("/swap/logs", data);
  //     if (response && response.error) {
  //       console.error("Error submitting trade log:", response.error);
  //     }
  //   } catch (error) {
  //     console.error("Error submitting trade log:", error);
  //   }
  // };

  // const handleSwapBonus = async (data: Route & any) => {
  //   if (!Object.keys($user).length) {
  //     return;
  //   }

  //   const txHash = (data.steps?.[0] as any)?.execution?.process?.[0]?.txHash;
  //   const volume = Number(data.steps?.[0]?.estimate?.fromAmountUSD || 0);
  //   isOpenModal = true;
  //   try {
  //     const response: any = await nimbus
  //       .post(
  //         `/onchain/${$userPublicAddress}/bonus?chain=${handleFormatIdBlockChain(data?.toChainId)}`,
  //         {
  //           volume,
  //           txHash,
  //           chain: handleFormatIdBlockChain(data?.toChainId),
  //           type: "swap",
  //         },
  //       )
  //       .then((res: any) => res.data);

  //     if (response && response?.message === "Claim bonus successfully") {
  //       mixpanel.track("user_swap_completed", {
  //         userAddress: $userPublicAddress,
  //         txHash,
  //         swapValue: volume,
  //         from_token_ca: data?.fromAddress || data?.fromToken?.address,
  //         from_token_chain: data?.fromChainId,
  //         to_token_ca: data?.toAddress || data?.toToken?.address,
  //         to_token_chain: data?.toChainId,
  //       });

  //       const connectedAddressSwap = data?.account?.address;

  //       const tradeLogPayload = {
  //         txHash,
  //         owner: connectedAddressSwap,
  //         token0: data?.fromAddress || data?.fromToken?.address,
  //         amount0: data?.fromAmount,
  //         token1: data?.toAddress || data?.toToken?.address,
  //         amount1: data?.toAmount,
  //         referrer: refAddressParam ? refAddressParam : undefined,
  //         trade_vol: volume,
  //       };

  //       tradeLog(tradeLogPayload);

  //       updateBalanceToken(data);
  //       forceRefreshHoldingToken($wallet, $typeWallet);
  //       queryClient?.invalidateQueries([$userPublicAddress, "daily-checkin"]);
  //       queryClient?.invalidateQueries(["rewards-progress"]);
  //       queryClient?.invalidateQueries(["rewards-status"]);
  //       triggerFireworkBonus(volume * 5);

  //       if (response?.data && response?.data?.length !== 0) {
  //         const formatMsgTokenBonus = response?.data
  //           ?.map((item: any) => {
  //             return `${numeral(item?.total).format("0,0.00")} ${item?.symbol}`;
  //           })
  //           .join(" and ");

  //         triggerToast(
  //           `🎉 ${formatMsgTokenBonus} granted! Check the Rewards section on the homepage.`,
  //           "success",
  //         );
  //       }
  //     }
  //   } catch (e: any) {
  //     triggerToast(
  //       "Failed when claiming reward. " + e?.response?.data?.error || e.message,
  //       "fail",
  //     );
  //     console.error(e);
  //   } finally {
  //     isOpenModal = false;
  //   }
  // };

  widgetEvents.on(WidgetEvent.PageEntered, (data) => {
    swapChangePage = data;
  });

  onDestroy(() => {
    widgetEvents.off(WidgetEvent.RouteExecutionCompleted);
  });

  let fromTokenParam = "";
  let toTokenParam = "";

  let paramsChain = 0;
  let paramsTokenInfo: any = {};

  widgetEvents.on(WidgetEvent.WalletConnected, async (data) => {
    if (Number(data.chainId) !== 0) {
      localStorage.setItem(
        "connectedWalletSwapChain",
        (data.chainId || 0)?.toString(),
      );
    } else {
      localStorage.setItem("connectedWalletSwapChain", "0");
    }
  });

  const handleSelectChainId = (chainId: number) => {
    paramsChain = chainId;
    fromTokenParam = "";
    toTokenParam = "";
    paramsTokenInfo = {};
    window.history.replaceState(
      null,
      "",
      window.location.pathname +
        `?fromChain=${paramsChain}&toChain=${paramsChain}`,
    );
  };

  const handleSelectToken = (data: any) => {
    paramsTokenInfo = data;
    handleChangeAddressChart();
  };

  const handleToggleChartCandles = (value: boolean) => {
    isShowChart = value;
    localStorage.setItem("showCandleChartSwap", value.toString());
    handleChangeAddressChart();
  };

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chainParams = urlParams.get("fromChain");
    const fromTokenParams = urlParams.get("fromToken");
    const toTokenParams = urlParams.get("toToken");
    const refAddress = urlParams.get("refAddress");

    if (refAddress) {
      refAddressParam = refAddress;
      localStorage.setItem("refAddressSwap", refAddress.toString());
    }

    if (chainParams && Number(chainParams) !== 0) {
      paramsChain = Number(chainParams);
      fromTokenParam = fromTokenParams || "";
      toTokenParam = toTokenParams || "";
    } else {
      const connectedWalletSwapChainStorage = localStorage.getItem(
        "connectedWalletSwapChain",
      );
      if (
        connectedWalletSwapChainStorage &&
        Number(connectedWalletSwapChainStorage) !== 0
      ) {
        paramsChain = Number(connectedWalletSwapChainStorage);
        fromTokenParam = fromTokenParams || "0x2::sui::SUI";
        toTokenParam =
          toTokenParams ||
          "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            `?fromChain=${Number(connectedWalletSwapChainStorage)}&toChain=${Number(connectedWalletSwapChainStorage)}${
              fromTokenParam ? `&fromToken=${fromTokenParam}` : ""
            }${toTokenParam ? `&toToken=${toTokenParam}` : ""}${refAddress ? `&refAddress=${refAddress}` : ""}`,
        );
      } else {
        paramsChain = 3342222192100821;
        fromTokenParam = fromTokenParams || "0x2::sui::SUI";
        toTokenParam =
          toTokenParams ||
          "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            `?fromChain=${3342222192100821}&toChain=${3342222192100821}${
              fromTokenParam ? `&fromToken=${fromTokenParam}` : ""
            }${toTokenParam ? `&toToken=${toTokenParam}` : ""}${refAddress ? `&refAddress=${refAddress}` : ""}`,
        );
      }
    }
  });

  const handleUpdateChain = async () => {
    if (paramsTokenInfo && Object.keys(paramsTokenInfo).length !== 0) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname +
          `?fromChain=${paramsChain}&fromToken=${paramsTokenInfo?.fromToken}&toChain=${paramsChain}&toToken=${paramsTokenInfo?.toToken}${refAddressParam ? `&refAddress=${refAddressParam}` : ""}`,
      );
    } else {
      await wait(100);
      window.history.replaceState(
        null,
        "",
        window.location.pathname +
          `?fromChain=${paramsChain}&toChain=${paramsChain}${
            fromTokenParam ? `&fromToken=${fromTokenParam}` : ""
          }${toTokenParam ? `&toToken=${toTokenParam}` : ""}${refAddressParam ? `&refAddress=${refAddressParam}` : ""}`,
      );
    }
  };

  $: {
    if (paramsChain || paramsTokenInfo) {
      handleUpdateChain();
    }
  }

  $: birdeyeChartUrl = `https://birdeye.so/tv-widget/${addressChart || "0x2::sui::SUI"}?chain=sui&viewMode=pair&chartInterval=5&chartType=CANDLE&chartTimezone=Asia%2FHo_Chi_Minh&chartLeftToolbar=show&theme=${$isDarkMode ? "dark" : "light"}`;
</script>

<ErrorBoundary>
  <div class="header-container lg:py-10 pt-[44px] md:pb-[144px] pb-[184px]">
    <div
      class="max-w-[1600px] m-auto xl:w-[82%] w-[90%] flex items-center justify-center min-h-screen"
    >
      <div class="flex flex-col gap-5 w-full h-full">
        <!-- <div class="text-4xl font-semibold text-white mb-5">{$t("Swap")}</div> -->
        <div
          class="flex lg:items-start items-center justify-center lg:gap-8 gap-5 lg:flex-row flex-col w-full h-full"
        >
          {#if isShowChart}
            <div class="lg:block hidden flex-1">
              <Motion
                initial="hidden"
                animate={isShowChart ? "visible" : "hidden"}
                variants={{
                  visible: { x: 0, display: "block" },
                  hidden: { x: 100, display: "none" },
                }}
                let:motion
              >
                <div
                  class={`rounded-[20px] overflow-hidden w-full ${
                    $isDarkMode ? "bg-[#222222]" : "bg-[#fff]"
                  }`}
                  use:motion
                >
                  <iframe
                    width="100%"
                    height="680"
                    src={birdeyeChartUrl}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </Motion>
            </div>

            <div class="lg:hidden block md:w-[416px] w-full order-2">
              <Motion
                initial="hidden"
                animate={isShowChart ? "visible" : "hidden"}
                variants={{
                  visible: { y: 0, display: "block" },
                  hidden: { y: -100, display: "none" },
                }}
                let:motion
              >
                <div
                  class={`rounded-[20px] overflow-hidden w-full ${
                    $isDarkMode ? "bg-[#222222]" : "bg-[#fff]"
                  }`}
                  use:motion
                >
                  <iframe
                    width="100%"
                    height="486"
                    src={birdeyeChartUrl}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </Motion>
            </div>
          {/if}

          <div
            class="swap_container rounded-[20px] overflow-x-hidden shadow-md h-full md:w-[416px] w-full lg:order-2 order-1"
          >
            {#if false}
              <div class="w-full h-[773px] flex items-center justify-center">
                <LoadingPremium />
              </div>
            {:else}
              <span class="relative">
                {#if Number(paramsChain) !== 0}
                  {#if $isDarkMode}
                    <ReactAdapter
                      element={NimbusSwapWidget}
                      integrator="nimbus-swap"
                      config={{
                        ...widgetConfig,
                        fromChain: paramsChain,
                        toChain: paramsChain,
                        fromToken: fromTokenParam,
                        toToken: toTokenParam,
                        // rewardSwapData: swapReward || [],
                        // handleSwapBonus,
                        handleSelectChainId,
                        handleSelectToken,
                        isUniversalSwap: true,
                        commissionBpsSDK: {
                          [ChainId.MOVE]:
                            refAddressParam.length !== 0 ? 0.3 * 100 : 0, // 0.3% swap fee when referral address is provided
                        },
                        isShowChartCandles: isShowChart,
                        handleToggleChartCandles,
                      }}
                    />
                  {:else}
                    <ReactAdapter
                      element={NimbusSwapWidget}
                      integrator="nimbus-swap"
                      config={{
                        ...widgetConfig,
                        fromChain: paramsChain,
                        toChain: paramsChain,
                        fromToken: fromTokenParam,
                        toToken: toTokenParam,
                        // rewardSwapData: swapReward || [],
                        // handleSwapBonus,
                        handleSelectChainId,
                        handleSelectToken,
                        isUniversalSwap: true,
                        commissionBpsSDK: {
                          [ChainId.MOVE]:
                            refAddressParam.length !== 0 ? 0.3 * 100 : 0, // 0.3% swap fee when referral address is provided
                        },
                        isShowChartCandles: isShowChart,
                        handleToggleChartCandles,
                      }}
                    />
                  {/if}
                {/if}
              </span>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</ErrorBoundary>

<!-- Modal loading bonus swap -->
<!-- <AppOverlay
  clickOutSideToClose
  isOpen={isOpenModal}
  isShowClose={false}
  on:close={() => {
    isOpenModal = false;
  }}
>
  <div class="flex flex-col items-center gap-4">
    <div class="flex justify-center items-center h-[68px]">
      <LoadingPremium />
    </div>
    <div class="text-sm text-gray-500 text-center">
      {$t("Please wait while we process and this may take a moment.")}<br />
      {$t("Thank you for your patience!")}
    </div>
  </div>
</AppOverlay> -->

<style>
  .header-container {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: top right;
    min-height: 100vh;
  }

  :global(body) .header-container {
    background-color: #27326f;
    background-image: url("~/assets/capa.svg");
  }
  :global(body.dark) .header-container {
    background-color: #080808;
    background-image: url("~/assets/capa-dark.svg");
  }

  :global(body) .swap_container {
    background: #fff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.1);
  }
  :global(body.dark) .swap_container {
    background: #0f0f0f;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 1);
  }
</style>
