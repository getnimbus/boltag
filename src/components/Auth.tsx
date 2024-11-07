import type { WalletState } from "nimbus-sui-kit";
import { SuiConnector } from "nimbus-sui-kit";
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../providers/ContextProvider";
import { nimbus } from "../lib/network";
import { toast } from "sonner";
import { Modal } from "./Modal";

const chains = [
  {
    id: "sui:mainnet",
    name: "Mainnet",
    rpcUrl:
      "https://api.zan.top/node/v1/sui/mainnet/98df431c14ad4b579e025d19e920689b",
  },
];

const shorterAddress = (string: string) => {
  return string ? string.slice(0, 6) + "..." + string.substr(-4) : string;
};

export const Auth = () => {
  const { suiWalletInstance, handleSetSuiWalletInstance } =
    useContext(GlobalStateContext);

  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const [isTrigger, setIsTrigger] = useState<boolean>(false);
  const [openModalSignMsgStashed, setOpenModalSignMsgStashed] =
    useState<boolean>(false);
  const [nonce, setNonce] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onConnectSuccess = (msg: any) => {
    console.log("Success connect: ", msg);
    if (suiWalletInstance) {
      (suiWalletInstance as WalletState).toggleSelect();
    }
  };

  const onConnectError = (msg: any) => {
    console.error("Error connect", msg);
    if (suiWalletInstance) {
      (suiWalletInstance as WalletState).toggleSelect();
    }
  };

  const widgetConfig = {
    walletFn: (wallet: WalletState) => {
      handleSetSuiWalletInstance(wallet);
    },
    onConnectSuccess,
    onConnectError,
  };

  const handleSignAddressMessage = async (nonce: string) => {
    const msg = await (suiWalletInstance !== null &&
      (suiWalletInstance as WalletState) &&
      (suiWalletInstance as WalletState)?.connected &&
      (suiWalletInstance as WalletState)?.signPersonalMessage({
        message: new TextEncoder().encode(
          `I am signing my one-time nonce: ${nonce}`,
        ),
      }));
    return msg;
  };

  useEffect(() => {
    const tokenStorage = localStorage.getItem("token");
    if (
      !tokenStorage &&
      suiWalletInstance !== null &&
      (suiWalletInstance as WalletState) &&
      (suiWalletInstance as WalletState)?.connected &&
      isTrigger
    ) {
      handleGetNonce(
        (suiWalletInstance as WalletState)?.account?.address || "",
      );
    }
  }, [suiWalletInstance, isTrigger]);

  const handleSignMsgFromStashed = async () => {
    const address =
      (suiWalletInstance !== null &&
        (suiWalletInstance as WalletState) &&
        (suiWalletInstance as WalletState)?.account?.address) ||
      "";

    const signature = await handleSignAddressMessage(nonce);

    if (signature && address) {
      const payload = {
        signature: signature.signature,
        publicAddress: address?.toLowerCase(),
      };
      handleGetSUIToken(payload);
    }
  };

  const handleGetNonce = async (address: string) => {
    setIsLoading(true);
    try {
      const res: any = await nimbus.post("/users/nonce", {
        publicAddress: address,
        referrer: undefined,
      });
      if (res && res.data) {
        setNonce(res.data.nonce);
        if (
          suiWalletInstance !== null &&
          (suiWalletInstance as WalletState) &&
          (suiWalletInstance as WalletState).name === "Stashed"
        ) {
          setOpenModalSignMsgStashed(true);
        } else {
          const signature = await handleSignAddressMessage(
            res.data.nonce as string,
          );
          if (signature) {
            const payload = {
              signature: signature.signature,
              publicAddress: address?.toLowerCase(),
            };
            handleGetSUIToken(payload);
          }
        }
      }
    } catch (e) {
      console.error("error: ", e);
      if (
        suiWalletInstance !== null &&
        (suiWalletInstance as WalletState) &&
        (suiWalletInstance as WalletState)?.connected
      ) {
        (suiWalletInstance as WalletState).disconnect();
      }
      setIsTrigger(false);
      setIsLoading(false);
    }
  };

  const handleGetSUIToken = async (data: any) => {
    try {
      const res: any = await nimbus.post("/auth/sui", data);
      if (res && res?.data?.result) {
        localStorage.setItem("token", res?.data?.result);
        toast.success("Connect wallet successfully!");
      } else {
        toast.error(res?.error);
      }
    } catch (e) {
      console.error("error: ", e);
      toast.error(
        "There are some problem when login Sui account. Please try again!",
      );
    } finally {
      setIsTrigger(false);
      setOpenModalSignMsgStashed(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <div
          className="rounded-[10px] py-2 px-3 text-white bg-[#1e96fc] text-sm font-medium cursor-pointer hover:bg-[#1878c9] transition-all"
          onClick={() => {
            if (!isLoading) {
              if (
                suiWalletInstance !== null &&
                (suiWalletInstance as WalletState)
              ) {
                if (
                  (suiWalletInstance as WalletState)?.status === "connected"
                ) {
                  setOpenPopover(!openPopover);
                } else {
                  setIsTrigger(true);
                  (suiWalletInstance as WalletState)?.toggleSelect();
                }
              }
            }
          }}
        >
          {suiWalletInstance !== null &&
          (suiWalletInstance as WalletState) &&
          (suiWalletInstance as WalletState)?.status === "connected" &&
          !isLoading ? (
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
            <>{isLoading ? "Loading..." : "Connect wallet"}</>
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
                  setNonce("");
                  setIsTrigger(false);
                  localStorage.removeItem("token");
                  setIsLoading(false);
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

      <SuiConnector config={widgetConfig} autoConnect={false} chains={chains} />

      <Modal
        isOpen={openModalSignMsgStashed}
        handleCloseModal={() => {
          setOpenModalSignMsgStashed(false);
        }}
      >
        <div className="flex flex-col gap-4 mt-4">
          <div className="font-medium text-center">
            Sign your Stashed Wallet to connect Bolt
          </div>
          <div className="flex justify-center gap-2">
            <div
              className="w-[120px] flex items-center justify-center rounded-[10px] py-2 px-3 text-white bg-[#1e96fc] text-sm font-medium cursor-pointer hover:bg-[#1878c9] transition-all"
              onClick={() => {
                handleSignMsgFromStashed();
              }}
            >
              Submit
            </div>
            <div
              className="w-[120px] flex items-center justify-center rounded-[10px] py-2 px-3 border text-sm font-medium cursor-pointer transition-all"
              onClick={() => {
                setOpenModalSignMsgStashed(false);
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
