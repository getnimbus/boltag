import { createContext, useState } from "react";
import type { WalletState } from "nimbus-sui-kit";

export const GlobalStateContext = createContext({
  suiWalletInstance: null,
  handleSetSuiWalletInstance: (wallet: WalletState) => {},
});

function ContextProvider({ children }: React.PropsWithChildren) {
  const [suiWalletInstance, setSuiWalletInstance] = useState<WalletState>(null);

  const handleSetSuiWalletInstance = (wallet: WalletState) => {
    setSuiWalletInstance(wallet);
  };

  return (
    <GlobalStateContext.Provider
      value={{ suiWalletInstance, handleSetSuiWalletInstance }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export default ContextProvider;
