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

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-4 h-4 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export const Auth = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDisconnectPopover, setShowDisconnectPopover] =
    useState<boolean>(false);

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
        <div className="relative">
          <div
            onClick={() => setShowDisconnectPopover(!showDisconnectPopover)}
            className="rounded-[10px] text-sm py-[10px] px-[12px] font-semibold text-black bg-white cursor-pointer transition-all hover:bg-gray-100 flex items-center"
          >
            {shorterAddress(account?.address)}
            <ChevronIcon isOpen={showDisconnectPopover} />
          </div>
          {showDisconnectPopover && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-[10px] shadow-lg border border-gray-200">
              <button
                onClick={() => {
                  disconnect();
                  setShowDisconnectPopover(false);
                }}
                className="w-full px-4 py-2 text-sm text-left text-red-500 transition-colors hover:bg-gray-100 rounded-[10px] font-medium"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      ) : (
        <ConnectModal
          trigger={
            <div className="rounded-[10px] text-sm py-[10px] px-[12px] font-bold text-white bg-[#1e96fc] cursor-pointer hover:bg-[#1878c9] transition-all">
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
