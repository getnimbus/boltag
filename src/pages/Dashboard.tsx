import { BubbleAnimateBg } from "../components/BubbleAnimateBg";
import { TradingVolume } from "../UI/Dashboard/TradingVolume";
import { RecentTransaction } from "../UI/Dashboard/RecentTransaction";
import { useContext, useEffect, useState } from "react";
import { wait } from "../utils";
import { toast } from "sonner";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { FormatNumber } from "../components/FormatNumber";
import { nimbus } from "../lib/network";
import { SuiInstanceStateContext } from "../providers/SuiInstanceProvider";
import type { WalletState } from "nimbus-sui-kit";
import { Modal } from "../components/Modal";
import { useQuery } from "@tanstack/react-query";

const getUserStats = async (address: string) => {
  const response = await nimbus
    .get(`/swap/${address}/stats`)
    .then((res: any) => res?.data);
  return response;
};

function Dashboard() {
  const { suiWalletInstance } = useContext(SuiInstanceStateContext);
  const [userAddress, setUserAddress] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const [nonce, setNonce] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isTriggerNonceOnce, setIsTriggerNonceOnce] = useState<boolean>(false);
  const [openModalSignMsgStashed, setOpenModalSignMsgStashed] =
    useState<boolean>(false);

  const [totalTradeVol, setTotalTradeVol] = useState<number>(0);
  const [totalRefShare, setTotalRefShare] = useState<number>(0);
  const [totalCommission, setTotalCommission] = useState<number>(0);

  const handleCopy = async (text: string) => {
    if (!navigator?.clipboard) {
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      await wait(300);
      setCopied(false);
      toast.success("Copied successfully!");
    } catch (error) {
      toast.error("Failed to copy text");
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("publicAddress") !== null &&
      localStorage.getItem("publicAddress") !== ""
    ) {
      setUserAddress(localStorage.getItem("publicAddress") || "");
    }
  }, []);

  useEffect(() => {
    const tokenStorage = localStorage.getItem("token");
    if (tokenStorage !== null) {
      setToken(tokenStorage);
    }
  }, []);

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

  const handleGetSUIToken = async (data: any) => {
    try {
      const res: any = await nimbus.post("/auth/sui", data);
      if (res && res?.data?.result) {
        localStorage.setItem("token", res?.data?.result);
        setToken(res?.data?.result);
        toast.success("Sign your wallet successfully!");
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

      setIsTriggerNonceOnce(false);
      setNonce("");
    }
  };

  const handleGetNonce = async (address: string) => {
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
    }
  };

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
    if (!isTriggerNonceOnce) {
      if (
        suiWalletInstance !== null &&
        (suiWalletInstance as WalletState) &&
        (suiWalletInstance as WalletState)?.connected
      ) {
        if (token.length === 0 && userAddress.length !== 0) {
          handleTriggerSignNonce();
        }
      }
    }
  }, [isTriggerNonceOnce, suiWalletInstance, token, userAddress]);

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

  // query user stats
  const { isLoading, isError, data } = useQuery({
    queryKey: ["user-stats", userAddress, token],
    queryFn: () => getUserStats(userAddress),
    enabled: Boolean(userAddress.length !== 0),
  });

  useEffect(() => {
    if (!isLoading && !isError && data && Object.keys(data).length !== 0) {
      setTotalTradeVol(Number(data?.total_vol || 0));
      setTotalRefShare(Number(data?.ref_friends || 0));
      setTotalCommission(Number(data?.commission || 0));
    }
  }, [data]);

  const link = `https://bolt.ag/?refAddress=${token ? userAddress : ""}`;

  return (
    <>
      <div className="relative overflow-hidden lg:pt-20 pt-[104px] pb-[144px] min-h-screen flex justify-center items-center">
        <div
          className="relative z-20 max-w-[1600px] m-auto xl:w-[88%] w-[90%] flex flex-col gap-8 bg-white rounded-[20px] p-6"
          style={{ boxShadow: "0px 0px 40px 0px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="grid grid-cols-1 gap-4 xl:col-span-4 col-span-full lg:grid-cols-4 md:grid-cols-2">
            <div className="col-span-1 border px-3 py-2 rounded-[8px] flex flex-col gap-1">
              <div className="text-[#00000099] md:text-base text-sm">
                Total Volume
              </div>
              <div className="text-2xl xl:text-3xl">
                <FormatNumber number={Number(totalTradeVol)} type="value" />
              </div>
            </div>

            <div className="col-span-1 border px-3 py-2 rounded-[8px] flex flex-col gap-1">
              <div className="text-[#00000099] md:text-base text-sm">
                Current Commission
              </div>
              <div className="text-2xl xl:text-3xl">
                {Number(totalTradeVol) !== 0
                  ? Number(totalTradeVol) < 100000
                    ? 60
                    : Number(totalTradeVol) >= 100000 &&
                        Number(totalTradeVol) < 500000
                      ? 70
                      : 80
                  : 0}
                %
              </div>
            </div>

            <div className="col-span-1 border px-3 py-2 rounded-[8px] flex flex-col gap-1">
              <div className="text-[#00000099] md:text-base text-sm">
                Total Friends Referred
              </div>
              <div className="text-2xl xl:text-3xl">
                {Number(totalRefShare)}
              </div>
            </div>

            <div className="col-span-1 border px-3 py-2 rounded-[8px] flex flex-col gap-1">
              <div className="text-[#00000099] md:text-base text-sm">
                Revenue Sharing
              </div>
              <div className="text-2xl xl:text-3xl">
                <FormatNumber number={Number(totalCommission)} type="value" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-xl font-medium">My Ref Link</div>
              <div className="text-base text-gray-500/75">
                Share ref link to your fans/friends to earn up to 80%
                commission.
                <a
                  href="https://getnimbus.notion.site/Bolt-ag-36f90f9ec9e4437bb03ce05d222674fd"
                  target="_blank"
                  className="ml-1 underline cursor-pointer transition-all hover:text-[#1e96fc] text-[#00000099]"
                >
                  Detail
                </a>
              </div>
            </div>

            <div className="h-full border px-3 py-2 rounded-[8px] flex justify-between items-center gap-1">
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[#00000099]">
                {link}
              </div>
              {token.length !== 0 && (
                <div
                  className="flex-1 cursor-pointer text-[#00000099]"
                  onClick={() => handleCopy(link)}
                >
                  {copied ? <CheckOutlined /> : <CopyOutlined />}
                </div>
              )}
            </div>
          </div>

          <TradingVolume userAddress={userAddress} token={token} />

          <RecentTransaction userAddress={userAddress} token={token} />
        </div>

        <BubbleAnimateBg isMainPage={false} />
      </div>

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
}

export default Dashboard;
