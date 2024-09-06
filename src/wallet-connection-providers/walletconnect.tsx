import { createWeb3Modal, defaultSolanaConfig } from '@web3modal/solana/react';
import { solana, solanaTestnet, solanaDevnet } from '@web3modal/solana/chains';

export const initializeWalletConnect = (props: {
  chains: Array<typeof solana | typeof solanaTestnet | typeof solanaDevnet>;
  projectId: string;
  metadata: {
    name: string;
    description: string;
    url: string;
    icons: Array<string>;
  };
}) => {
  const solanaConfig = defaultSolanaConfig({
    ...props,
    auth: undefined,
  });

  createWeb3Modal({
    solanaConfig,
    chains: props.chains,
    projectId: props.projectId,
    wallets: [
      // Solana wallet adapters (check Custom connectors for more info)
    ],
  });
};
