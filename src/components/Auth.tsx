// import type { WalletState } from "nimbus-sui-kit";
// import { SuiConnector } from "nimbus-sui-kit";
// import { useContext, useState } from "react";
// import { GlobalStateContext } from "../providers/ContextProvider";

// const chains = [
//   {
//     id: "sui:mainnet",
//     name: "Mainnet",
//     rpcUrl:
//       "https://api.zan.top/node/v1/sui/mainnet/98df431c14ad4b579e025d19e920689b",
//   },
// ];

export const Auth = () => {
  // const { suiWalletInstance, handleSetSuiWalletInstance } =
  //   useContext(GlobalStateContext);

  // const [openPopover, setOpenPopover] = useState<boolean>(false);

  // const onConnectSuccess = (msg: any) => {
  //   console.log("Success connect: ", msg);
  //   if (suiWalletInstance) {
  //     (suiWalletInstance as WalletState).toggleSelect();
  //   }
  // };

  // const onConnectError = (msg: any) => {
  //   console.error("Error connect", msg);
  //   if (suiWalletInstance) {
  //     (suiWalletInstance as WalletState).toggleSelect();
  //   }
  // };

  // const widgetConfig = {
  //   walletFn: (wallet: WalletState) => {
  //     if (
  //       suiWalletInstance === null ||
  //       (suiWalletInstance !== null &&
  //         (suiWalletInstance as WalletState) &&
  //         !(suiWalletInstance as WalletState)?.connected)
  //     ) {
  //       handleSetSuiWalletInstance(wallet);
  //     }
  //   },
  //   onConnectSuccess,
  //   onConnectError,
  // };

  // const shorterAddress = (string: string) => {
  //   return string ? string.slice(0, 6) + "..." + string.substr(-4) : string;
  // };

  return (
    <>
      {/* <div className="relative">
        <div
          className="rounded-[10px] py-2 px-3 text-white bg-[#1e96fc] text-sm font-medium cursor-pointer hover:bg-[#1878c9] transition-all"
          onClick={() => {
            if (
              suiWalletInstance !== null &&
              (suiWalletInstance as WalletState)
            ) {
              if ((suiWalletInstance as WalletState)?.status === "connected") {
                setOpenPopover(!openPopover);
              } else {
                (suiWalletInstance as WalletState)?.toggleSelect();
              }
            }
          }}
        >
          {suiWalletInstance !== null &&
          (suiWalletInstance as WalletState) &&
          (suiWalletInstance as WalletState)?.status === "connected" ? (
            <div className="flex items-center gap-2">
              {shorterAddress(
                (suiWalletInstance as WalletState)?.account?.address || "",
              )}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1790_28273)">
                  <path
                    d="M9.99989 10.9766L14.1249 6.85156L15.3032 8.0299L9.99989 13.3332L4.69656 8.0299L5.87489 6.85156L9.99989 10.9766Z"
                    fill="currentColor"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_1790_28273">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(20) rotate(90)"
                    ></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
          ) : (
            "Connect wallet"
          )}
        </div>

        {openPopover ? (
          <div className="popover bg-white xl:w-[200px] xl:min-w-[200px] xl:max-h-[310px] max-h-[380px] md:w-[300px] md:min-w-[300px] w-[240px] min-w-[240px] mt-2 right-0">
            <div
              className="popover_content"
              onClick={() => {
                if (
                  suiWalletInstance !== null &&
                  (suiWalletInstance as WalletState) &&
                  (suiWalletInstance as WalletState)?.connected
                ) {
                  (suiWalletInstance as WalletState)?.disconnect();
                  setOpenPopover(false);
                }
              }}
            >
              <div className="text-base font-medium text-black">Disconnect</div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <SuiConnector config={widgetConfig} autoConnect={false} chains={chains} /> */}
      hello world
    </>
  );
};
