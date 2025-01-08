import { useState, useEffect, useMemo, useContext } from "react";
import { nimbus } from "../lib/network";
import {
  HiddenUI,
  NimbusSwapWidget,
  type WidgetConfig,
  WidgetEvent,
  widgetEvents,
} from "nimbus-universal-swap";
import { wait } from "../utils";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import hmac from "js-crypto-hmac";
import { BubbleAnimateBg } from "../components/BubbleAnimateBg";
import { SuiInstanceStateContext } from "../contexts/SuiInstanceProvider";
import type { WalletState } from "nimbus-sui-kit";
import { normalizeSuiAddress } from "@mysten/sui/utils";
import { useTheme } from "../contexts/ThemeProvider";
import { sendDiscordWebhook } from "send-discord-webhook";

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

const listNativeToken = [
  "0x2::sui::SUI",
  "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
  "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
  "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN",
];

const SUIAddress = "0x2::sui::SUI";
const USDTAddress =
  "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN";

function Main() {
  const { theme } = useTheme();
  const { suiWalletInstance } = useContext(SuiInstanceStateContext);
  const [isShowChart, setIsShowChart] = useState<boolean>(false);
  const [addressChart, setAddressChart] = useState<string>(SUIAddress);
  const [refAddressParam, setRefAddressParam] = useState<string>("");

  const [fromTokenParam, setFromTokenParam] = useState<string>("");
  const [toTokenParam, setToTokenParam] = useState<string>("");

  const [paramsChain, setParamsChain] = useState<number>(0);
  const [paramsTokenInfo, setParamsTokenInfo] = useState<any>({});

  const widgetConfig = useMemo(() => {
    return {
      appearance:
        theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : theme,
      theme: {
        palette: {
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
      sdkConfig: {
        rpcUrls: {
          [ChainId.SOL]: [
            "https://rpc-aggregator.service.getnimbus.io/solana_das?key=28ad52be-5b89-4c0a-8ce9-e053c053466b",
          ],
        },
      },
    };
  }, [theme]) as WidgetConfig;

  const handleChangeAddressChart = () => {
    if (paramsTokenInfo && Object.keys(paramsTokenInfo)?.length !== 0) {
      if (
        listNativeToken.includes(paramsTokenInfo.fromToken) &&
        listNativeToken.includes(paramsTokenInfo.toToken)
      ) {
        setAddressChart(SUIAddress);
      } else if (listNativeToken.includes(paramsTokenInfo.fromToken)) {
        setAddressChart(paramsTokenInfo.toToken);
      } else if (listNativeToken.includes(paramsTokenInfo.toToken)) {
        setAddressChart(paramsTokenInfo.fromToken);
      } else {
        setAddressChart(paramsTokenInfo.toToken || SUIAddress);
      }
    }
  };

  useEffect(() => {
    const showCandleChartSwapStorage = localStorage.getItem(
      "showCandleChartSwap",
    );
    const refAddressSwapStorage = localStorage.getItem("refAddressSwap");

    if (refAddressSwapStorage && refAddressSwapStorage !== null) {
      setRefAddressParam(refAddressSwapStorage);
    }

    if (showCandleChartSwapStorage && showCandleChartSwapStorage !== null) {
      setIsShowChart(showCandleChartSwapStorage === "true");
    }
  }, []);

  widgetEvents.on(WidgetEvent.WalletConnected, async (data) => {
    if (Number(data.chainId) !== 0) {
      localStorage.setItem("publicAddress", data.address || "");
      localStorage.setItem(
        "connectedWalletSwapChain",
        (data.chainId || 0)?.toString(),
      );
    } else {
      localStorage.setItem("publicAddress", "");
      localStorage.setItem("connectedWalletSwapChain", "0");
      handleLogout();
    }
  });

  const handleLogout = async () => {
    await wait(2000);
    if (
      localStorage.getItem("connectedWalletSwapChain") &&
      localStorage.getItem("connectedWalletSwapChain") === "0" &&
      suiWalletInstance !== null &&
      (suiWalletInstance as WalletState) &&
      (suiWalletInstance as WalletState)?.connected
    ) {
      localStorage.removeItem("token");
      (suiWalletInstance as WalletState)?.disconnect();
      window.location.reload();
    }
  };

  const handleSelectChainId = (chainId: number) => {
    if (paramsChain !== chainId && paramsChain !== 0) {
      setParamsChain(chainId);
      setFromTokenParam("");
      setToTokenParam("");
      setParamsTokenInfo({});
      window.history.replaceState(
        null,
        "",
        window.location.pathname +
          `?fromChain=${paramsChain}&toChain=${paramsChain}`,
      );
    }
  };

  const handleSelectToken = (data: any) => {
    if (data && Object.keys(data).length !== 0) {
      if (data.fromToken !== paramsTokenInfo.fromToken) {
        setParamsTokenInfo({
          fromToken: data.fromToken,
          toToken: paramsTokenInfo.toToken,
        });
        handleChangeAddressChart();
      }
      if (data.toToken !== paramsTokenInfo.toToken) {
        setParamsTokenInfo({
          toToken: data.toToken,
          fromToken: paramsTokenInfo.fromToken,
        });
        handleChangeAddressChart();
      }
      if (
        data.toToken !== paramsTokenInfo.toToken &&
        data.fromToken !== paramsTokenInfo.fromToken
      ) {
        setParamsTokenInfo(data);
        handleChangeAddressChart();
      }
    }
  };

  const handleToggleChartCandles = (value: boolean) => {
    setIsShowChart(value);
    localStorage.setItem("showCandleChartSwap", value.toString());
    handleChangeAddressChart();
  };

  const handleCheckParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const chainParams = urlParams.get("fromChain");
    const fromTokenParams = urlParams.get("fromToken");
    const toTokenParams = urlParams.get("toToken");
    const refAddress = urlParams.get("refAddress");

    if (refAddress && refAddress !== undefined) {
      setRefAddressParam(refAddress);
      localStorage.setItem("refAddressSwap", refAddress.toString());
    }

    if (chainParams && chainParams !== undefined && Number(chainParams) !== 0) {
      setParamsChain(Number(chainParams));
      setFromTokenParam(fromTokenParams ? fromTokenParams : SUIAddress);
      setToTokenParam(toTokenParams ? toTokenParams : USDTAddress);
    } else {
      const connectedWalletSwapChainStorage = localStorage.getItem(
        "connectedWalletSwapChain",
      );
      if (
        connectedWalletSwapChainStorage &&
        Number(connectedWalletSwapChainStorage) !== 0
      ) {
        setParamsChain(Number(connectedWalletSwapChainStorage));
        setFromTokenParam(fromTokenParams ? fromTokenParams : SUIAddress);
        setToTokenParam(toTokenParams ? toTokenParams : USDTAddress);
        if (Number(connectedWalletSwapChainStorage) !== 0) {
          window.history.replaceState(
            null,
            "",
            window.location.pathname +
              `?fromChain=${Number(
                connectedWalletSwapChainStorage,
              )}&toChain=${Number(connectedWalletSwapChainStorage)}${
                fromTokenParam ? `&fromToken=${fromTokenParam}` : ""
              }${toTokenParam ? `&toToken=${toTokenParam}` : ""}${
                refAddress ? `&refAddress=${refAddress}` : ""
              }`,
          );
        }
      } else {
        setParamsChain(ChainId.MOVE);
        setFromTokenParam(fromTokenParams ? fromTokenParams : SUIAddress);
        setToTokenParam(toTokenParams ? toTokenParams : USDTAddress);
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            `?fromChain=${ChainId.MOVE}&toChain=${ChainId.MOVE}${
              fromTokenParam ? `&fromToken=${fromTokenParam}` : ""
            }${toTokenParam ? `&toToken=${toTokenParam}` : ""}${
              refAddress ? `&refAddress=${refAddress}` : ""
            }`,
        );
      }
    }
  };

  useEffect(() => {
    handleCheckParams();
  }, []);

  const handleUpdateChain = async () => {
    if (Number(paramsChain) !== 0) {
      if (paramsTokenInfo && Object.keys(paramsTokenInfo).length !== 0) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            `?fromChain=${paramsChain}&fromToken=${
              paramsTokenInfo?.fromToken
            }&toChain=${paramsChain}&toToken=${paramsTokenInfo?.toToken}${
              refAddressParam ? `&refAddress=${refAddressParam}` : ""
            }`,
        );
      } else {
        await wait(200);
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            `?fromChain=${paramsChain}&toChain=${paramsChain}${
              fromTokenParam ? `&fromToken=${fromTokenParam}` : ""
            }${toTokenParam ? `&toToken=${toTokenParam}` : ""}${
              refAddressParam ? `&refAddress=${refAddressParam}` : ""
            }`,
        );
      }
    }
  };

  useEffect(() => {
    if (paramsChain || paramsTokenInfo) {
      handleUpdateChain();
    }
  }, [paramsChain, paramsTokenInfo]);

  const handleFormatSuiAddress = (address: string) => {
    if (address === "0x2::sui::SUI") {
      return address;
    }

    const regexSymbol = /::(.+)/;
    const matchSymbol = address.match(regexSymbol);

    const resultSymbol = matchSymbol && matchSymbol[0];

    const regexAddress = /^[^:]+/;
    const matchAddress = address.match(regexAddress);

    const resultAddress = matchAddress && matchAddress[0];

    return normalizeSuiAddress(resultAddress || "") + resultSymbol;
  };

  const birdeyeChartUrl = useMemo(() => {
    return `https://birdeye.so/tv-widget/${handleFormatSuiAddress(
      addressChart || SUIAddress,
    )}?chain=sui&viewMode=pair&chartInterval=5&chartType=CANDLE&chartLeftToolbar=show&theme=${
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme
    }`;
  }, [addressChart, theme]);

  const handleSwapLog = async (data: any) => {
    try {
      sendDiscordWebhook({
        url: import.meta.env.VITE_DISCORD_WEBHOOK_URL,
        title: "🚨 Swap fail",
        description: `Swap fail address ${data?.address}`,
        fields: [
          {
            name: "title",
            value: `${data?.title}`,
          },
          {
            name: "msg",
            value: `${data?.message}`,
          },
          {
            name: "chain",
            value: `${data?.chainName}`,
          },
          {
            name: "tx hash",
            value: `https://suivision.xyz/txblock/${data.transactionHash}}`,
          },
          {
            name: "amount",
            value: `${data.amount}`,
          },
          {
            name: "symbol",
            value: `${data?.symbol}`,
          },
        ],
      })
        .then(() => console.log("Alert successful"))
        .catch((e) => {
          console.error(e);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwapBonus = async (data: any) => {
    try {
      const txHash = data?.steps?.[0]?.execution?.process?.[0]?.txHash;
      const volume = Number(data?.fromAmountUSD || 0);

      const connectedAddressSwap = data?.account?.address;

      const aggregator = data?.steps?.[0]?.integrator?.toLowerCase();

      const payload = {
        txHash,
        owner: connectedAddressSwap,
        token0: data?.fromToken?.address,
        amount0: Number(
          Number(data?.fromAmount) / 10 ** data?.fromToken?.decimals,
        )?.toString(),
        token1: data?.toToken?.address,
        amount1: Number(
          Number(data?.toAmount) / 10 ** data?.toToken?.decimals,
        )?.toString(),
        referrer: refAddressParam.length !== 0 ? refAddressParam : undefined,
        trade_vol: volume,
        aggregator,
      };

      const now = dayjs().valueOf();

      const computed = await hmac.compute(
        Buffer.from(import.meta.env.VITE_TRADE_REQUEST_KEY),
        Buffer.from(`${now}:${JSON.stringify(payload)}`),
        "SHA-256",
      );

      const sig = Buffer.from(computed.buffer).toString("base64");

      if (Number(payload.trade_vol) >= 5000) {
        sendDiscordWebhook({
          url: import.meta.env.VITE_DISCORD_WEBHOOK_URL,
          title: "Swap vol > $5k",
          description: "Swap vol > $5k",
          fields: [
            {
              name: "tx hash",
              value: `https://suivision.xyz/txblock/${txHash}`,
            },
            {
              name: "vol",
              value: `$${payload.trade_vol}`,
            },
          ],
        })
          .then(() => console.log("Alert successful"))
          .catch((e) => {
            console.error(e);
          });
      }

      const response: any = await nimbus.post("/swap/logs", payload, {
        headers: {
          "x-signature": sig,
          "x-request-timestamp": now,
        },
      });
      if (response && response.error) {
        console.error("Error submitting trade log:", response.error);
      }
    } catch (error: any) {
      console.error("Error submitting trade log:", error);
      sendDiscordWebhook({
        url: import.meta.env.VITE_DISCORD_WEBHOOK_URL,
        title: "🚨 Error when tracking log swap",
        description: error.message,
        fields: [
          {
            name: "tx hash",
            value: data?.steps?.[0]?.execution?.process?.[0]?.txHash,
          },
          {
            name: "connected address",
            value: data?.account?.address,
          },
          {
            name: "aggregator",
            value: data?.steps?.[0]?.integrator?.toLowerCase(),
          },
          {
            name: "token0",
            value: data?.fromToken?.address,
          },
          {
            name: "amount0",
            value: Number(
              Number(data?.fromAmount) / 10 ** data?.fromToken?.decimals,
            )?.toString(),
          },
          {
            name: "token1",
            value: data?.toToken?.address,
          },
          {
            name: "amount1",
            value: Number(
              Number(data?.toAmount) / 10 ** data?.toToken?.decimals,
            )?.toString(),
          },
          {
            name: "trade volume",
            value: Number(data?.fromAmountUSD || 0),
          },
          {
            name: "ref address",
            value: refAddressParam,
          },
        ],
      })
        .then(() => console.log("Alert successful"))
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const handleSelectedToken = (token: any) => {
    if (token) {
      setToTokenParam(token.address);
      setAddressChart(token.address);
    }
  };

  return (
    <div className="relative overflow-hidden lg:pt-20 pt-[104px] pb-[144px] min-h-screen flex justify-center items-center">
      <div
        className={`relative z-20 m-auto flex items-center justify-center md:px-0 px-5 ${
          isShowChart
            ? "max-w-[1600px] xl:w-[82%] lg:w-[90%] md:w-max"
            : "w-max"
        }`}
      >
        <div className="flex flex-col w-full h-full gap-10">
          <div className="text-3xl font-semibold text-center">
            Get the best swap routes <br /> from FlowX, Cetus, Aftermath, NAVI
            and 7K.
          </div>

          <div className="flex flex-col items-center justify-center gap-5 lg:items-start lg:gap-8 lg:flex-row">
            {isShowChart ? (
              <>
                <div className="flex-1 hidden lg:block">
                  <motion.div
                    initial="hidden"
                    animate={isShowChart ? "visible" : "hidden"}
                    variants={{
                      visible: { x: 0, display: "block" },
                      hidden: { x: 100, display: "none" },
                    }}
                    className="rounded-[20px] overflow-hidden w-full bg-white dark:bg-[#121212]"
                    style={{
                      boxShadow: "0px 0px 40px 0px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <iframe
                      width="100%"
                      height="680"
                      src={birdeyeChartUrl}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </motion.div>
                </div>

                <div className="lg:hidden block md:w-[416px] w-full order-2">
                  <motion.div
                    initial="hidden"
                    animate={isShowChart ? "visible" : "hidden"}
                    variants={{
                      visible: { y: 0, display: "block" },
                      hidden: { y: -100, display: "none" },
                    }}
                    className="rounded-[20px] overflow-hidden w-full bg-white dark:bg-[#121212]"
                    style={{
                      boxShadow: "0px 0px 40px 0px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <iframe
                      width="100%"
                      height="486"
                      src={birdeyeChartUrl}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </motion.div>
                </div>
              </>
            ) : null}

            <div
              className="bg-white dark:bg-[#121212] rounded-[20px] overflow-x-hidden shadow-md h-full md:w-[416px] w-full lg:order-2 order-1"
              style={{ boxShadow: "0px 0px 40px 0px rgba(0, 0, 0, 0.1)" }}
            >
              {Number(paramsChain) !== 0 ? (
                <NimbusSwapWidget
                  config={{
                    ...widgetConfig,
                    fromChain: paramsChain,
                    toChain: paramsChain,
                    fromToken: fromTokenParam,
                    toToken: toTokenParam,
                    handleSwapBonus,
                    handleSwapLog,
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
                  integrator="nimbus-swap"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <BubbleAnimateBg
        handleSelectedToken={handleSelectedToken}
        isMainPage={true}
      />
    </div>
  );
}

export default Main;
