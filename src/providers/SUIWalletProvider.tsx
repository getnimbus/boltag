import {
  WalletProvider,
  defineStashedWallet,
  AllDefaultWallets,
} from "@suiet/wallet-kit";

const stashedWalletConfig = defineStashedWallet({
  appName: "Nimbus",
});

const chains = [
  {
    id: "sui:mainnet",
    name: "Mainnet",
    rpcUrl:
      "https://api.zan.top/node/v1/sui/mainnet/98df431c14ad4b579e025d19e920689b",
  },
];

function SUIWalletProvider({ children }: React.PropsWithChildren) {
  return (
    <WalletProvider
      defaultWallets={[stashedWalletConfig, ...AllDefaultWallets]}
      autoConnect={true}
      chains={chains}
    >
      {children}
    </WalletProvider>
  );
}

export default SUIWalletProvider;
