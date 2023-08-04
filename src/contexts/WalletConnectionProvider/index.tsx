import React, { FC, PropsWithChildren, useMemo } from 'react'
import { WalletProvider } from '@solana/wallet-adapter-react'

import { PreviouslyConnectedProvider } from './previouslyConnectedProvider'
import {
  IHardcodedWalletStandardAdapter,
} from './HardcodedWalletStandardAdapter'
import { Adapter } from '@solana/wallet-adapter-base'
import { SolanaMobileWalletAdapter, createDefaultAddressSelector, createDefaultAuthorizationResultCache } from '@solana-mobile/wallet-adapter-mobile'
import { Cluster } from '@solana/web3.js'
export const MWA_NOT_FOUND_ERROR = 'MWA_NOT_FOUND_ERROR'

const noop = () => { }

export interface ICometKitConfig {
  autoConnect: boolean;
  metadata: ICometKitMetadata;
  env: Cluster;
}

export interface ICometKitMetadata {
  name: string;
  url: string;
  description: string;
  iconUrls: string[]; // full uri, first icon will be used as main icon (png, jpg, svg)
  additionalInfo?: string;
  walletConnectProjectId?: string; // wallet connect app id, register your app on WalletConnect website
}

const WalletConnectionProvider: FC<
  PropsWithChildren & {
    wallets: Adapter[],
    config: ICometKitConfig;
    hardcodedWalletStandard?: IHardcodedWalletStandardAdapter[]
  }
> = ({ wallets: passedWallets, config, children }) => {
  const wallets = useMemo(() => {
    return [
      new SolanaMobileWalletAdapter({
        addressSelector: createDefaultAddressSelector(),
        appIdentity: config.metadata,
        authorizationResultCache: createDefaultAuthorizationResultCache(),
        cluster: config.env,
        onWalletNotFound: async (
          mobileWalletAdapter: SolanaMobileWalletAdapter,
        ) => {
          throw new Error(MWA_NOT_FOUND_ERROR)
        },
      }),
      ...passedWallets,
    ]
  }, [])

  return (
    <WalletProvider wallets={wallets} autoConnect onError={noop}>
      <PreviouslyConnectedProvider>{children}</PreviouslyConnectedProvider>
    </WalletProvider>
  )
}

export default WalletConnectionProvider
