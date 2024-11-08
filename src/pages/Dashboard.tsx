import { BubbleAnimateBg } from "../components/BubbleAnimateBg";
import { TradingVolume } from "../UI/Dashboard/TradingVolume";
import { RecentTransaction } from "../UI/Dashboard/RecentTransaction";
import { useContext, useEffect, useState } from "react";
import { wait } from "../utils";
import { toast } from "sonner";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { FormatNumber } from "../components/FormatNumber";
import { GlobalStateContext } from "../providers/ContextProvider";

function Dashboard() {
  const { totalTradeVol } = useContext(GlobalStateContext);
  const [userAddress, setUserAddress] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

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

  const link = `https://bolt.ag/?refAddress=${userAddress}`;

  return (
    <div className="relative overflow-hidden lg:pt-20 pt-[104px] pb-[144px] min-h-screen flex justify-center items-center">
      <div
        className="relative z-20 max-w-[1600px] m-auto xl:w-[88%] w-[90%] flex flex-col gap-8 bg-white rounded-[20px] p-6"
        style={{ boxShadow: "0px 0px 40px 0px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-xl font-medium">My Ref Link</div>
            <div className="text-base text-gray-500">
              Share ref link to your fans/friends to earn up to 80% commission.
              <a
                href="https://getnimbus.notion.site/Bolt-ag-36f90f9ec9e4437bb03ce05d222674fd"
                target="_blank"
                className="ml-1 underline cursor-pointer transition-all hover:text-[#1e96fc] text-black"
              >
                Detail
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-col-3">
            <div className="h-full col-span-1 xl:col-span-2">
              <div className="h-full border px-3 py-2 rounded-[8px] flex justify-between items-center gap-4">
                <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {link}
                </div>
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => handleCopy(link)}
                >
                  {copied ? <CheckOutlined /> : <CopyOutlined />}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 col-span-1 gap-4 md:grid-cols-2">
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
                  {Number(totalTradeVol) < 100000
                    ? 60
                    : Number(totalTradeVol) >= 100000 &&
                        Number(totalTradeVol) < 500000
                      ? 70
                      : 80}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <TradingVolume userAddress={userAddress} />
          <RecentTransaction userAddress={userAddress} />
        </div>
      </div>

      <BubbleAnimateBg isMainPage={false} />
    </div>
  );
}

export default Dashboard;
