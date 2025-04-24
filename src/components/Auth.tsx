import type { WalletState } from "nimbus-sui-wallet";
import { useContext, useEffect, useState } from "react";
import { SuiInstanceStateContext } from "../contexts/SuiInstanceProvider";

import {
  ConnectModal,
  useDisconnectWallet,
  useCurrentAccount,
  useSignPersonalMessage,
  useSignAndExecuteTransaction,
  useReportTransactionEffects,
  useSignTransaction,
} from "@mysten/dapp-kit";

const shorterAddress = (string: string) => {
  return string ? string.slice(0, 6) + "..." + string.substr(-4) : string;
};

export const Auth = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { suiWalletInstance, handleSetSuiWalletInstance } = useContext(
    SuiInstanceStateContext,
  );

  const { mutateAsync: signTransaction } = useSignTransaction();
  const { mutateAsync: reportTransactionEffects } =
    useReportTransactionEffects();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { mutate: signPersonalMessage } = useSignPersonalMessage();
  const { mutate: disconnect } = useDisconnectWallet();
  const account = useCurrentAccount();

  const wallet = {
    signTransaction: async (input: { transaction: string }) => {
      return await signTransaction(input);
    },
    reportTransactionEffects: async (input: { effects: string }) => {
      return await reportTransactionEffects(input);
    },
    signAndExecuteTransaction: async (input: { transaction: string }) => {
      return await signAndExecuteTransaction(input);
    },
    signPersonalMessage: async (input: { message: Uint8Array }) => {
      return await signPersonalMessage(input);
    },
    disconnect: async () => {
      await disconnect();
    },
    account: account,
    connected: !!account,
    status: account ? "connected" : "disconnected",
    address: account?.address,
    name: account?.chains?.[0],
  };

  useEffect(() => {
    if (account && account?.address) {
      setShowModal(false);
    }
  }, [account]);

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

  return (
    <>
      {account && account?.address ? (
        <div className="rounded-[10px] text-sm py-[9px] px-[12px] font-semibold text-black bg-white cursor-pointer transition-all">
          <div onClick={() => disconnect()}>
            {shorterAddress(account?.address)}
          </div>
        </div>
      ) : (
        <ConnectModal
          trigger={
            <div className="rounded-[10px] text-sm py-[9px] px-[12px] font-bold text-white bg-[#1e96fc] cursor-pointer hover:bg-[#1878c9] transition-all">
              Connect wallet
            </div>
          }
          open={showModal}
          onOpenChange={(isOpen) => setShowModal(isOpen)}
        />
      )}
    </>
  );
};
