import type { WalletState } from "nimbus-sui-kit";
import { SuiConnector } from "nimbus-sui-kit";
import { useContext, useEffect, useState } from "react";
import { SuiInstanceStateContext } from "../providers/SuiInstanceProvider";
import { nimbus } from "../lib/network";
import { toast } from "sonner";
import { Modal } from "./Modal";

import Arrow from "../assets/arrow.svg";

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
  const { suiWalletInstance, handleSetSuiWalletInstance } = useContext(
    SuiInstanceStateContext,
  );

  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const [openModalSignMsgStashed, setOpenModalSignMsgStashed] =
    useState<boolean>(false);
  const [nonce, setNonce] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [isTriggerNonceOnce, setIsTriggerNonceOnce] = useState<boolean>(false);

  const onConnectSuccess = (msg: any) => {
    console.error("Success connect", msg);
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
    return await (suiWalletInstance !== null &&
      (suiWalletInstance as WalletState) &&
      (suiWalletInstance as WalletState)?.connected &&
      (suiWalletInstance as WalletState)?.signPersonalMessage({
        message: new TextEncoder().encode(
          `I am signing my one-time nonce: ${nonce}`,
        ),
      }));
  };

  useEffect(() => {
    const tokenStorage = localStorage.getItem("token");
    if (tokenStorage !== null) {
      setToken(tokenStorage);
    }
  }, []);

  const handleTriggerSignNonce = () => {
    setIsTriggerNonceOnce(true);
    handleGetNonce(
      (suiWalletInstance !== null &&
        (suiWalletInstance as WalletState) &&
        (suiWalletInstance as WalletState)?.connected &&
        (suiWalletInstance as WalletState)?.account?.address) ||
        "",
    );
  };

  useEffect(() => {
    if (
      suiWalletInstance !== null &&
      (suiWalletInstance as WalletState) &&
      (suiWalletInstance as WalletState)?.connected
    ) {
      if (token.length === 0 && !isTriggerNonceOnce) {
        handleTriggerSignNonce();
      }
    }
  }, [suiWalletInstance, isTriggerNonceOnce, token]);

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
      setOpenModalSignMsgStashed(false);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (
      suiWalletInstance !== null &&
      (suiWalletInstance as WalletState) &&
      (suiWalletInstance as WalletState)?.connected
    ) {
      (suiWalletInstance as WalletState)?.disconnect();
    }
    setOpenPopover(false);
    setNonce("");
    localStorage.removeItem("token");
    setIsLoading(false);
    window.location.reload();
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
                  (suiWalletInstance as WalletState)?.toggleSelect();
                }
              }
            }
          }}
        >
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              {suiWalletInstance !== null &&
              (suiWalletInstance as WalletState) &&
              (suiWalletInstance as WalletState)?.status === "connected" ? (
                <div className="flex items-center gap-2">
                  {shorterAddress(
                    (suiWalletInstance as WalletState)?.account?.address || "",
                  )}
                  <img src={Arrow} alt="" />
                </div>
              ) : (
                <>Connect wallet</>
              )}
            </>
          )}
        </div>

        {openPopover ? (
          <div className="popover bg-white xl:w-[200px] xl:min-w-[200px] xl:max-h-[310px] max-h-[380px] md:w-[300px] md:min-w-[300px] w-[240px] min-w-[240px] mt-2 right-0">
            <div
              className="popover_content"
              onClick={() => {
                handleLogout();
              }}
            >
              <div className="text-base font-medium text-black">Disconnect</div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      <SuiConnector config={widgetConfig} autoConnect={true} chains={chains} />

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
