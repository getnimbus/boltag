import { useState, useEffect, useMemo } from "react";
import { nimbus } from "./lib/network";
import {
  HiddenUI,
  NimbusSwapWidget,
  type Route,
  type WidgetConfig,
  WidgetEvent,
  widgetEvents,
} from "nimbus-universal-swap";
import { wait } from "./utils";
import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";

const listDefaultToken = [
  {
    logo: "https://assets.coingecko.com/coins/images/33243/standard/voloSUI_%283%29.png",
    symbol: "vSUI",
    address:
      "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT",
  },
  {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/7192.png",
    symbol: "wBNB",
    address:
      "0xb848cce11ef3a8f62eccea6eb5b35a12c4c2b1ee1af7755d02d7bd6218e8226f::coin::COIN",
  },
  {
    logo: "https://api.movepump.com/uploads/Asset_10geckos_square_c7be378110.PNG",
    symbol: "GECKO",
    address:
      "0x9f9cd83d94e8f53c6505956539afc0c852cb57c9bcae3e55d275877900ce9ed9::gecko::GECKO",
  },
  {
    logo: "https://assets.coingecko.com/coins/images/33610/standard/pug-head.png?1702513072",
    symbol: "FUD",
    address:
      "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD",
  },
  {
    logo: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/bluemove.png/public",
    symbol: "MOVE",
    address:
      "0xd9f9b0b4f35276eecd1eea6985bfabe2a2bbd5575f9adb9162ccbdb4ddebde7f::smove::SMOVE",
  },
  {
    logo: "https://i.ibb.co/ySTnZB2/image.png",
    symbol: "TURBOS",
    address:
      "0x5d1f47ea69bb0de31c313d7acf89b890dbb8991ea8e03c6c355171f84bb1ba4a::turbos::TURBOS",
  },
  {
    logo: "https://ipfs.io/ipfs/QmXGaEc2XPKZetBesrZrDUfYF6UgQ7VRk8wuCVCobDt6wg",
    symbol: "PepeGOAT",
    address:
      "0xc2edf324c59ad2481b47e327a710cb5353074af254560b3182d91b3a7feab6c0::PEPEGOAT::PEPEGOAT",
  },
  {
    logo: "https://i.imgur.com/xH1sEC5.png",
    symbol: "SHUI",
    address:
      "0x239e9725bdab1fcb2e4798a057da809e52f13134a09bc9913659d4a80ddfdaad::shui::SHUI",
  },
  {
    logo: "https://ipfs.io/ipfs/bafkreig53olo3ewrkph3hfrhjuwvuj53pmbntl2cwxd4zlyfnj5eznoxcu",
    symbol: "FLX",
    address:
      "0x6dae8ca14311574fdfe555524ea48558e3d1360d1607d1c7f98af867e3b7976c::flx::FLX",
  },
  {
    logo: "https://gateway.pinata.cloud/ipfs/QmQv4usd5eMQYMp93E5pASEWyQP9JCi7QM3bAaWhVfz4pn",
    symbol: "HOPI",
    address:
      "0xc9e497ea76280864615dc97dce4479585ac9b767a014428448df3b8f95310e3f::hopi::HOPI",
  },
  {
    logo: "https://pntvpw2m7uxvx7j4roojxy3sb2lrc57jqzwo66kafwdjaj5v3oea.arweave.net/e2dX20z9L1v9PIucm-NyDpcRd-mGbO95QC2GkCe124g",
    symbol: "SBOX",
    address:
      "0xbff8dc60d3f714f678cd4490ff08cabbea95d308c6de47a150c79cc875e0c7c6::sbox::SBOX",
  },
  {
    logo: "https://ipfs.io/ipfs/QmYH4seo7K9CiFqHGDmhbZmzewHEapAhN9aqLRA7af2vMW",
    symbol: "BUCK",
    address:
      "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK",
  },
  {
    logo: "https://assets.haedal.xyz/logos/hasui.svg",
    symbol: "haSUI",
    address:
      "0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI",
  },
];

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

const random = () => {
  return {
    randomX: Math.random() * 100,
    randomY: Math.random() * 100,
    token: Math.random() * 5,
  };
};

const tokenAnimation = (index: number) => {
  return keyframes`
    0%, 100% {
      transform: translateY(${-random().token * index}px);
    }
    50% {
      transform: translateY(${random().token * index}px);
    }
  `;
};

const listDefaultTokenPosition = listDefaultToken.map((item, index) => {
  const randomSize = Math.round(Math.random() * (120 - 60) + 60);

  return {
    ...item,
    randomSize,
    left: random().randomX + index,
    top: random().randomY + index,
  };
});

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
      "showCandleChartSwap",
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
        (data.chainId || 0)?.toString(),
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
        "connectedWalletSwapChain",
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
              connectedWalletSwapChainStorage,
            )}&toChain=${Number(connectedWalletSwapChainStorage)}${
              fromTokenParam ? `&fromToken=${fromTokenParam}` : ""
            }${toTokenParam ? `&toToken=${toTokenParam}` : ""}${
              refAddress ? `&refAddress=${refAddress}` : ""
            }`,
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
            }`,
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
          }`,
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
          }`,
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

  const handleSwapBonus = async (data: Route & any) => {
    const txHash = (data.steps?.[0] as any)?.execution?.process?.[0]?.txHash;
    const volume = Number(data.steps?.[0]?.estimate?.fromAmountUSD || 0);

    const connectedAddressSwap = data?.account?.address;

    const tradeLogPayload = {
      txHash,
      owner: connectedAddressSwap,
      token0: data?.fromAddress || data?.fromToken?.address,
      amount0: data?.fromAmount,
      token1: data?.toAddress || data?.toToken?.address,
      amount1: data?.toAmount,
      referrer: refAddressParam ? refAddressParam : undefined,
      trade_vol: volume,
    };

    try {
      const response: any = await nimbus.post("/swap/logs", tradeLogPayload);
      if (response && response.error) {
        console.error("Error submitting trade log:", response.error);
      }
    } catch (error) {
      console.error("Error submitting trade log:", error);
    }
  };

  const handleSelectedToken = (token: any) => {
    setToTokenParam(token.address);
    setAddressChart(token.address);
  };

  const AnimatedDiv = styled.div<{ $index: number }>`
    animation: ${(props) => {
        return tokenAnimation(props.$index);
      }}
      5522.1ms infinite linear;
  `;

  return (
    <div className="relative overflow-hidden lg:pt-20 pt-[104px] pb-[144px] min-h-screen flex justify-center items-center">
      <div
        className={`relative z-20 m-auto flex items-center justify-center ${
          isShowChart
            ? "max-w-[1600px] xl:w-[82%] lg:w-[90%] md:w-max"
            : "w-max"
        }`}
      >
        <div className="flex flex-col w-full h-full gap-10">
          <div className="text-3xl font-semibold text-center">
            Get the best swap routes <br /> from Hop, FlowX and 7K
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
                    className="rounded-[20px] overflow-hidden w-full bg-white"
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
                    handleSwapBonus,
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

      <div className="absolute inset-0 z-10 w-full h-full backdrop-blur-sm bg-white/30">
        <div
          className="relative w-full h-full"
          style={{
            flexShrink: 0,
          }}
        >
          {listDefaultTokenPosition.map((token, index) => {
            return (
              <motion.div
                key={token.symbol}
                className="absolute group"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                style={{
                  width: `${token.randomSize}px`,
                  height: `${token.randomSize}px`,
                  left: `${token.left}%`,
                  top: `${token.top}%`,
                }}
              >
                <AnimatedDiv $index={index + 1}>
                  <div
                    className="flex items-center justify-center w-full h-full p-4 transition-all rounded-full cursor-pointer hover:border group"
                    style={{
                      borderColor: "rgba(30, 150, 252, 0.2)",
                    }}
                    onClick={() => {
                      handleSelectedToken(token);
                    }}
                  >
                    <img
                      src={token.logo}
                      alt=""
                      style={{
                        borderColor: "rgba(30, 150, 252, 0.4)",
                        animationName: "tokenAnimationRotate",
                        animationDuration: "5522.1ms",
                        animationIterationCount: "infinite",
                        animationTimingFunction: "linear",
                      }}
                      className="w-full h-full overflow-hidden transition-all rounded-full group-hover:border group-hover:scale-125 group-hover:rotate-12 group-hover:p-1"
                    />
                  </div>

                  <div className="absolute hidden text-sm transform -translate-x-1/2 group-hover:block -bottom-6 left-1/2">
                    {token.symbol}
                  </div>

                  <div className="absolute inset-0 block rounded-full bg-white/30 backdrop-blur-sm group-hover:hidden"></div>
                </AnimatedDiv>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
