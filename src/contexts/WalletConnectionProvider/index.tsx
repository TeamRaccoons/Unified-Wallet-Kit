import React, { FC, PropsWithChildren, useMemo } from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import * as AllWalletAdapters from '@solana/wallet-adapter-wallets';
import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  SolanaMobileWalletAdapter,
} from '@solana-mobile/wallet-adapter-mobile';
import { Cluster } from '@solana/web3.js';

import { PreviouslyConnectedProvider } from './previouslyConnectedProvider';
export const MWA_NOT_FOUND_ERROR = 'MWA_NOT_FOUND_ERROR';

const noop = () => { };

interface IMetadataMobileWallet {
  uri: string;
  icon: string;
  name: string;
}

// TODO: We need to support plugging in custom wallet adapter, such as Nightly, WalletConnect
const WalletConnectionProvider: FC<PropsWithChildren & { metadata: IMetadataMobileWallet }> = ({ metadata, children }) => {
  // TODO: Support devnet
  const env: Cluster = 'mainnet-beta';

  const wallets = useMemo(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const {
      UnsafeBurnerWalletAdapter: _,
      WalletConnectWalletAdapter,
      ...allwalletAdatpers
    } = AllWalletAdapters;

    const walletAdapters = Object.keys(allwalletAdatpers)
      .filter((key) => key.includes('Adapter'))
      .map((key) => (allwalletAdatpers as any)[key])
      .map((WalletAdapter: any) => new WalletAdapter()); // Intentional any, TS were being annoying

    return [
      ...walletAdapters,
      new SolanaMobileWalletAdapter({
        addressSelector: createDefaultAddressSelector(),
        appIdentity: metadata,
        authorizationResultCache: createDefaultAuthorizationResultCache(),
        cluster: env as Cluster,
        onWalletNotFound: async (mobileWalletAdapter: SolanaMobileWalletAdapter) => {
          throw new Error(MWA_NOT_FOUND_ERROR);
        },
      }),
    ].filter((item) => item.name && item.icon);
  }, [env, metadata]);

  return (
    <WalletProvider wallets={wallets} autoConnect onError={noop}>
      <PreviouslyConnectedProvider>{children}</PreviouslyConnectedProvider>
    </WalletProvider>
  );
};

export default WalletConnectionProvider;
