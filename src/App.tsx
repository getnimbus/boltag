import {
  HiddenUI,
  NimbusSwapWidget,
  type WidgetConfig,
  WidgetEvent,
  widgetEvents,
} from "nimbus-universal-swap";
import { wait } from "./utils";
import { motion } from "framer-motion";

import Capa from "./assets/capa.svg";
import { useState, useEffect, useMemo } from "react";

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
const USDCAddress =
  "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";

function App() {
  const [isShowChart, setIsShowChart] = useState<boolean>(false);
  const [addressChart, setAddressChart] = useState<string>(SUIAddress);
  const [refAddressParam, setRefAddressParam] = useState<string>("");

  const [fromTokenParam, setFromTokenParam] = useState<string>("");
  const [toTokenParam, setToTokenParam] = useState<string>("");

  const [paramsChain, setParamsChain] = useState<number>(0);
  const [paramsTokenInfo, setParamsTokenInfo] = useState<any>({});

  const widgetConfig: WidgetConfig = {
    appearance: "light",
    theme: {
      palette: {
        background: {
          default: "#fff",
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
    sdkConfig: {
      rpcUrls: {
        [ChainId.SOL]: [
          "https://rpc-aggregator.service.getnimbus.io/solana_das?key=28ad52be-5b89-4c0a-8ce9-e053c053466b",
        ],
      },
    },
  };

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
      "showCandleChartSwap"
    );
    const refAddressSwapStorage = localStorage.getItem("refAddressSwap");

    if (refAddressSwapStorage) {
      setRefAddressParam(refAddressSwapStorage);
    }

    if (showCandleChartSwapStorage) {
      setIsShowChart(showCandleChartSwapStorage === "true");
    }
  }, []);

  widgetEvents.on(WidgetEvent.WalletConnected, async (data) => {
    if (Number(data.chainId) !== 0) {
      localStorage.setItem(
        "connectedWalletSwapChain",
        (data.chainId || 0)?.toString()
      );
    } else {
      localStorage.setItem("connectedWalletSwapChain", "0");
    }
  });

  const handleSelectChainId = (chainId: number) => {
    if (paramsChain !== chainId) {
      setParamsChain(chainId);
      setFromTokenParam("");
      setToTokenParam("");
      setParamsTokenInfo({});
      window.history.replaceState(
        null,
        "",
        window.location.pathname +
          `?fromChain=${paramsChain}&toChain=${paramsChain}`
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chainParams = urlParams.get("fromChain");
    const fromTokenParams = urlParams.get("fromToken");
    const toTokenParams = urlParams.get("toToken");
    const refAddress = urlParams.get("refAddress");

    if (refAddress) {
      setRefAddressParam(refAddress);
      localStorage.setItem("refAddressSwap", refAddress.toString());
    }

    if (chainParams && Number(chainParams) !== 0) {
      setParamsChain(Number(chainParams));
      setFromTokenParam(fromTokenParams || SUIAddress);
      setToTokenParam(toTokenParams || USDCAddress);
    } else {
      const connectedWalletSwapChainStorage = localStorage.getItem(
        "connectedWalletSwapChain"
      );
      if (
        connectedWalletSwapChainStorage &&
        Number(connectedWalletSwapChainStorage) !== 0
      ) {
        setParamsChain(Number(connectedWalletSwapChainStorage));
        setFromTokenParam(fromTokenParams || SUIAddress);
        setToTokenParam(toTokenParams || USDCAddress);
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            `?fromChain=${Number(
              connectedWalletSwapChainStorage
            )}&toChain=${Number(connectedWalletSwapChainStorage)}${
              fromTokenParam ? `&fromToken=${fromTokenParam}` : ""
            }${toTokenParam ? `&toToken=${toTokenParam}` : ""}${
              refAddress ? `&refAddress=${refAddress}` : ""
            }`
        );
      } else {
        setParamsChain(ChainId.MOVE);
        setFromTokenParam(fromTokenParams || SUIAddress);
        setToTokenParam(toTokenParams || USDCAddress);
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            `?fromChain=${ChainId.MOVE}&toChain=${ChainId.MOVE}${
              fromTokenParam ? `&fromToken=${fromTokenParam}` : ""
            }${toTokenParam ? `&toToken=${toTokenParam}` : ""}${
              refAddress ? `&refAddress=${refAddress}` : ""
            }`
        );
      }
    }
  }, []);

  const handleUpdateChain = async () => {
    if (paramsTokenInfo && Object.keys(paramsTokenInfo).length !== 0) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname +
          `?fromChain=${paramsChain}&fromToken=${
            paramsTokenInfo?.fromToken
          }&toChain=${paramsChain}&toToken=${paramsTokenInfo?.toToken}${
            refAddressParam ? `&refAddress=${refAddressParam}` : ""
          }`
      );
    } else {
      await wait(100);
      window.history.replaceState(
        null,
        "",
        window.location.pathname +
          `?fromChain=${paramsChain}&toChain=${paramsChain}${
            fromTokenParam ? `&fromToken=${fromTokenParam}` : ""
          }${toTokenParam ? `&toToken=${toTokenParam}` : ""}${
            refAddressParam ? `&refAddress=${refAddressParam}` : ""
          }`
      );
    }
  };

  useEffect(() => {
    if (paramsChain || paramsTokenInfo) {
      handleUpdateChain();
    }
  }, [paramsChain, paramsTokenInfo, handleUpdateChain]);

  const birdeyeChartUrl = useMemo(() => {
    return `https://birdeye.so/tv-widget/${
      addressChart || SUIAddress
    }?chain=sui&viewMode=pair&chartInterval=5&chartType=CANDLE&chartLeftToolbar=show&theme=light`;
  }, [addressChart]);

  return (
    <div
      style={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top right",
        minHeight: "100vh",
        backgroundColor: "#27326f",
        backgroundImage: `url(${Capa})`,
      }}
    >
      <div className="max-w-[1600px] m-auto xl:w-[82%] w-[90%] flex items-center justify-center min-h-screen lg:pt-20 pt-[44px] md:pb-[144px] pb-[184px]">
        <div className="flex flex-col w-full h-full gap-10">
          <div className="text-4xl font-semibold text-center text-white">
            Sui's Scary Fast & Custom Swap Aggregator
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
                    className="rounded-[20px] overflow-hidden w-full bg-white"
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
                    className="rounded-[20px] overflow-hidden w-full bg-white"
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
            ) : (
              <div className="lg:h-[680px]"></div>
            )}

            <div
              className="bg-white rounded-[20px] overflow-x-hidden shadow-md h-full md:w-[416px] w-full lg:order-2 order-1"
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
    </div>
  );
}

export default App;
