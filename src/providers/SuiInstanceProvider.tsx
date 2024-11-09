import { createContext, useState } from "react";

export const SuiInstanceStateContext = createContext({
  suiWalletInstance: null,
  handleSetSuiWalletInstance: (_wallet: any) => {},

  isTriggerLogout: false,
  toggleTriggerLogout: () => {},
});

function SuiInstanceProvider({ children }: React.PropsWithChildren) {
  const [suiWalletInstance, setSuiWalletInstance] = useState<any>(null);

  const [isTriggerLogout, setIsTriggerLogOut] = useState<boolean>(false);

  const toggleTriggerLogout = () => {
    setIsTriggerLogOut(!isTriggerLogout);
  };

  const handleSetSuiWalletInstance = (wallet: any) => {
    setSuiWalletInstance(wallet);
  };

  return (
    <SuiInstanceStateContext.Provider
      value={{
        suiWalletInstance,
        handleSetSuiWalletInstance,

        isTriggerLogout,
        toggleTriggerLogout,
      }}
    >
      {children}
    </SuiInstanceStateContext.Provider>
  );
}

export default SuiInstanceProvider;
