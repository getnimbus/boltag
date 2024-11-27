import { createContext, useState } from "react";

export const SuiInstanceStateContext = createContext({
  suiWalletInstance: null,
  handleSetSuiWalletInstance: (_wallet: any) => {},
});

function SuiInstanceProvider({ children }: React.PropsWithChildren) {
  const [suiWalletInstance, setSuiWalletInstance] = useState<any>(null);

  const handleSetSuiWalletInstance = (wallet: any) => {
    setSuiWalletInstance(wallet);
  };

  return (
    <SuiInstanceStateContext.Provider
      value={{
        suiWalletInstance,
        handleSetSuiWalletInstance,
      }}
    >
      {children}
    </SuiInstanceStateContext.Provider>
  );
}

export default SuiInstanceProvider;
