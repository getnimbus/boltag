import { BubbleAnimateBg } from "../components/BubbleAnimateBg";
import { TradingVolume } from "../UI/Dashboard/TradingVolume";
import { RecentTransaction } from "../UI/Dashboard/RecentTransaction";
import { useEffect, useState } from "react";
import { wait } from "../utils";
import { toast } from "sonner";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";

function Dashboard() {
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
        className="relative z-20 max-w-[1600px] m-auto xl:w-[88%] w-[90%] flex flex-col gap-6 bg-white rounded-[20px] p-6 min-h-screen"
        style={{ boxShadow: "0px 0px 40px 0px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex flex-col gap-2">
          <div className="text-xl font-medium">My Ref Link</div>
          <div className="border px-3 py-2 rounded-[8px] flex justify-between items-center gap-4">
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

        <TradingVolume userAddress={userAddress} />

        <RecentTransaction userAddress={userAddress} />
      </div>

      <BubbleAnimateBg isMainPage={false} />
    </div>
  );
}

export default Dashboard;
