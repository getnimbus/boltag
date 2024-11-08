import { createContext, useState } from "react";

export const GlobalStateContext = createContext({
  totalTradeVol: 0,
  handleSetTotalTradeVol: (value: number) => {},
});

function ContextProvider({ children }: React.PropsWithChildren) {
  const [totalTradeVol, setTotalTradeVol] = useState<number>(0);

  const handleSetTotalTradeVol = (value: number) => {
    setTotalTradeVol(value);
  };

  return (
    <GlobalStateContext.Provider
      value={{
        totalTradeVol,
        handleSetTotalTradeVol,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export default ContextProvider;
