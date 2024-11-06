import { createContext, useState } from "react";

export const GlobalStateContext = createContext({
  suiWalletInstance: null,
  handleSetSuiWalletInstance: (wallet: any) => {},
});

function ContextProvider({ children }: React.PropsWithChildren) {
  const [suiWalletInstance, setSuiWalletInstance] = useState<any>(null);

  const handleSetSuiWalletInstance = (wallet: any) => {
    setSuiWalletInstance(wallet);
  };

  return (
    <GlobalStateContext.Provider
      value={{
        suiWalletInstance,
        handleSetSuiWalletInstance,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export default ContextProvider;
