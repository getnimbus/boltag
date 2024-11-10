import { SuiInstanceStateContext } from "../providers/SuiInstanceProvider";
import type { WalletState } from "nimbus-sui-kit";
import { useContext } from "react";
import { Link } from "@tanstack/react-router";
import {
  WalletProvider,
  defineStashedWallet,
  AllDefaultWallets,
} from "@suiet/wallet-kit";
import { Auth } from "./Auth";

import Bolt from "../assets/bolt.png";

const chains = [
  {
    id: "sui:mainnet",
    name: "Mainnet",
    rpcUrl:
      "https://api.zan.top/node/v1/sui/mainnet/98df431c14ad4b579e025d19e920689b",
  },
];

const stashedWalletConfig = defineStashedWallet({
  appName: "Nimbus",
});

export const Header = () => {
  const { suiWalletInstance } = useContext(SuiInstanceStateContext);

  return (
    <WalletProvider
      autoConnect={true}
      chains={chains}
      defaultWallets={[stashedWalletConfig, ...AllDefaultWallets]}
    >
      <div className="fixed top-0 left-0 z-30 w-full backdrop-blur-sm bg-white/30">
        <div className="max-w-[1600px] m-auto xl:w-[88%] w-[90%] py-2 flex justify-between items-center">
          <Link to="/">
            <div className="flex items-center -ml-4 cursor-pointer">
              <img src={Bolt} alt="logo" className="w-12 h-12" />
              <div className="-ml-2 font-medium">Bolt</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {(suiWalletInstance !== null &&
              (suiWalletInstance as WalletState) &&
              (suiWalletInstance as WalletState)?.status === "connected") ||
            localStorage.getItem("token") ? (
              <Link to="/dashboard">
                <div className="rounded-[10px] py-3 px-3 text-sm font-medium transition-all cursor-pointer bg-[#f3f3f4] hover:bg-[#eeeeef]">
                  Dashboard
                </div>
              </Link>
            ) : (
              <div className="rounded-[10px] py-[10px] px-3 text-sm font-medium transition-all cursor-pointer bg-gray-200 text-gray-400">
                Dashboard
              </div>
            )}

            <Auth />
          </div>
        </div>
      </div>
    </WalletProvider>
  );
};
