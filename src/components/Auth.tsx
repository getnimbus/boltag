import type { WalletState } from "nimbus-sui-kit";
import { useContext, useEffect } from "react";
import { SuiInstanceStateContext } from "../contexts/SuiInstanceProvider";

import { ConnectButton, useWallet } from "@suiet/wallet-kit";

export const Auth = () => {
  const { suiWalletInstance, handleSetSuiWalletInstance } = useContext(
    SuiInstanceStateContext,
  );

  const wallet = useWallet();

  useEffect(() => {
    if (suiWalletInstance === null) {
      handleSetSuiWalletInstance(wallet);
    }

    if (
      wallet &&
      wallet.connected &&
      suiWalletInstance !== null &&
      (suiWalletInstance as WalletState) &&
      (suiWalletInstance as WalletState)?.connected !== wallet.connected
    ) {
      handleSetSuiWalletInstance(wallet);
    }

    if (
      !wallet.connected &&
      suiWalletInstance !== null &&
      suiWalletInstance !== null &&
      (suiWalletInstance as WalletState) &&
      (suiWalletInstance as WalletState)?.connected !== wallet.connected
    ) {
      handleSetSuiWalletInstance(wallet);
      localStorage.removeItem("token");
      window.location.reload();
    }
  }, [wallet]);

  return <ConnectButton>Connect wallet</ConnectButton>;
};
