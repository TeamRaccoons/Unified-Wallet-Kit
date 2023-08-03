import React, { FC, PropsWithChildren, useMemo } from 'react'
import { WalletProvider } from '@solana/wallet-adapter-react'
import * as AllWalletAdapters from '@solana/wallet-adapter-wallets'
import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  SolanaMobileWalletAdapter,
} from '@solana-mobile/wallet-adapter-mobile'
import { Cluster } from '@solana/web3.js'
import { NCSolanaWalletAdapter } from '@nightlylabs/connect-solana';

import { PreviouslyConnectedProvider } from './previouslyConnectedProvider'
import HardcodedWalletStandardAdapter, {
  IHardcodedWalletStandardAdapter,
} from './HardcodedWalletStandardAdapter'
import { BaseSignerWalletAdapter, BaseWalletAdapter, WalletAdapterNetwork } from '@solana/wallet-adapter-base'
export const MWA_NOT_FOUND_ERROR = 'MWA_NOT_FOUND_ERROR'

const noop = () => { }

export interface ICometKitMetadata {
  name: string;
  url: string;
  description: string;
  iconUrls: string[]; // full uri, first icon will be used as main icon (png, jpg, svg)
  additionalInfo?: string;
  walletConnectProjectId?: string; // wallet connect app id, register your app on WalletConnect website
}

type WalletAdapterWithMutableSupportedTransactionVersions<T> = Omit<T, 'supportedTransactionVersions'> & {
  supportedTransactionVersions: BaseWalletAdapter['supportedTransactionVersions'];
};

// TODO: We need to support plugging in custom wallet adapter, such as Nightly, WalletConnect
const WalletConnectionProvider: FC<
  PropsWithChildren & {
    metadata: ICometKitMetadata
    hardcodedWalletStandard?: IHardcodedWalletStandardAdapter[]
  }
> = ({ metadata, hardcodedWalletStandard, children }) => {
  // TODO: Support devnet
  const env: Cluster = 'mainnet-beta'

  const wallets = useMemo(() => {
    if (typeof window === 'undefined') {
      return []
    }

    const {
      UnsafeBurnerWalletAdapter: _,
      WalletConnectWalletAdapter,
      ...allwalletAdatpers
    } = AllWalletAdapters

    const walletAdapters = Object.keys(allwalletAdatpers)
      .filter(key => key.includes('Adapter'))
      .map(key => (allwalletAdatpers as any)[key])
      .map((WalletAdapter: any) => new WalletAdapter()) // Intentional any, TS were being annoying

    const NightlyConnectWallet = new NCSolanaWalletAdapter({
      appMetadata: {
        application: metadata.name,
        description: metadata.description,
        additionalInfo: metadata.additionalInfo || '',
        icon: metadata.iconUrls[0],
      }
    })

    const walletConnectWalletAdapter: WalletAdapterWithMutableSupportedTransactionVersions<BaseSignerWalletAdapter> | null = (() => {
      if (!metadata.walletConnectProjectId) return null;

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
    })()


    return [
      ...walletAdapters,
      new SolanaMobileWalletAdapter({
        addressSelector: createDefaultAddressSelector(),
        appIdentity: metadata,
        authorizationResultCache: createDefaultAuthorizationResultCache(),
        cluster: env as Cluster,
        onWalletNotFound: async (
          mobileWalletAdapter: SolanaMobileWalletAdapter,
        ) => {
          throw new Error(MWA_NOT_FOUND_ERROR)
        },
      }),
      NightlyConnectWallet,
      walletConnectWalletAdapter,
      ...(hardcodedWalletStandard || []).map(
        item => new HardcodedWalletStandardAdapter(item),
      ),
    ].filter(item => item.name && item.icon)
  }, [env, metadata])

  return (
    <WalletProvider wallets={wallets} autoConnect onError={noop}>
      <PreviouslyConnectedProvider>{children}</PreviouslyConnectedProvider>
    </WalletProvider>
  )
}

export default WalletConnectionProvider
