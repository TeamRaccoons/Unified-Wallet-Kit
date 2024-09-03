import React from 'react';
import { createWeb3Modal, defaultSolanaConfig } from '@web3modal/solana/react';
import { solana, solanaTestnet, solanaDevnet } from '@web3modal/solana/chains';

// 0. Setup chains
const chains = [solana, solanaTestnet, solanaDevnet];
const projectId = '4a4e231c4004ef7b77076a87094fba61';
const metadata = {
  name: 'Jupiter',
  description: 'Jupiter: The best swap aggregator on Solana.  Built for smart traders who like money.',
  url: 'https://jup.ag',
  icons: ['https://jup.ag/svg/jupiter-logo.svg'],
};

const solanaConfig = defaultSolanaConfig({
  metadata,
  chains,
  projectId,
  auth: undefined,
});

export const initializeWalletConnect = () => {
  createWeb3Modal({
    solanaConfig,
    chains,
    projectId,
    wallets: [
      // Solana wallet adapters (check Custom connectors for more info)
    ],
  });
};
