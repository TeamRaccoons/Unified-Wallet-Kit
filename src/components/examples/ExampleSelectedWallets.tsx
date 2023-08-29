import React, { useMemo } from 'react';
import { UnifiedWalletProvider } from 'src/contexts/UnifiedWalletProvider';
import { UnifiedWalletButton } from '../UnifiedWalletButton';

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  BackpackWalletAdapter,
  GlowWalletAdapter,
  TrustWalletAdapter,
  WalletConnectWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletAdapterWithMutableSupportedTransactionVersions, metadata } from './constants';
import { Adapter, BaseSignerWalletAdapter, WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import WalletNotification from './WalletNotification';

const ExampleSelectedWallets = () => {
  const wallets: Adapter[] = useMemo(() => {
    const walletConnectWalletAdapter: WalletAdapterWithMutableSupportedTransactionVersions<BaseSignerWalletAdapter> | null = (() => {
      const adapter: WalletAdapterWithMutableSupportedTransactionVersions<BaseSignerWalletAdapter> = new WalletConnectWalletAdapter({
        network: WalletAdapterNetwork.Mainnet,
        options: {
          relayUrl: 'wss://relay.walletconnect.com',
          projectId: metadata.walletConnectProjectId,
          metadata: {
            name: metadata.name,
            description: metadata.description,
            url: metadata.url,
            icons: metadata.iconUrls,
          },
        },
      });

        // While sometimes supported, it mostly isn't. Should this be dynamic in the wallet-adapter instead?
        adapter.supportedTransactionVersions = new Set(['legacy']);
        return adapter;
      })();

    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new BackpackWalletAdapter(),
      new GlowWalletAdapter(),
      new TrustWalletAdapter(),
      walletConnectWalletAdapter,
    ].filter((item) => item && item.name && item.icon) as Adapter[];
  }, []);

  return (
    <UnifiedWalletProvider
      wallets={wallets}
      passThroughWallet={null}
      config={{
        autoConnect: false,
        env: 'mainnet-beta',
        metadata: {
          name: 'UnifiedWallet',
          description: 'UnifiedWallet',
          url: 'https://jup.ag',
          iconUrls: ['https://jup.ag/favicon.ico'],
        },
        notificationCallback: WalletNotification,
      }}
    >
      <UnifiedWalletButton />
    </UnifiedWalletProvider>
  );
};

export default ExampleSelectedWallets;
