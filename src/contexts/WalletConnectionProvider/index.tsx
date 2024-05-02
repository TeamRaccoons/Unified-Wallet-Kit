import React, { FC, PropsWithChildren, ReactNode, useMemo } from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { Adapter, SupportedTransactionVersions, WalletError, WalletName } from '@solana/wallet-adapter-base';
import {
  SolanaMobileWalletAdapter,
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
} from '@solana-mobile/wallet-adapter-mobile';
import { Cluster } from '@solana/web3.js';

import { PreviouslyConnectedProvider } from './previouslyConnectedProvider';
import HardcodedWalletStandardAdapter, { IHardcodedWalletStandardAdapter } from './HardcodedWalletStandardAdapter';
import { IUnifiedTheme } from '../UnifiedWalletContext';
import { AllLanguage } from '../TranslationProvider/i18n';

const noop = (error: WalletError, adapter?: Adapter) => {
  console.log({ error, adapter });
};

export interface IWalletNotification {
  publicKey: string;
  shortAddress: string;
  walletName: string;
  metadata: {
    name: string;
    url: string;
    icon: string;
    supportedTransactionVersions?: SupportedTransactionVersions;
  };
}

export interface IUnifiedWalletConfig {
  autoConnect: boolean;
  metadata: IUnifiedWalletMetadata;
  env: Cluster;
  walletPrecedence?: WalletName[];
  hardcodedWallets?: IHardcodedWalletStandardAdapter[];
  notificationCallback?: {
    onConnect: (props: IWalletNotification) => void;
    onConnecting: (props: IWalletNotification) => void;
    onDisconnect: (props: IWalletNotification) => void;
    onNotInstalled: (props: IWalletNotification) => void;
    // TODO: Support wallet account change
    // onChangeAccount: (props: IWalletNotification) => void,
  };
  walletlistExplanation?: {
    href: string;
  };
  // Default to light
  theme?: IUnifiedTheme;
  lang?: AllLanguage;
  walletAttachments?: Record<string, { attachment: ReactNode }>;
  walletModalAttachments?: {
    footer?: ReactNode;
  };
}

export interface IUnifiedWalletMetadata {
  name: string;
  url: string;
  description: string;
  iconUrls: string[]; // full uri, first icon will be used as main icon (png, jpg, svg)
  additionalInfo?: string;
}

const WalletConnectionProvider: FC<
  PropsWithChildren & {
    wallets: Adapter[];
    config: IUnifiedWalletConfig;
  }
> = ({ wallets: passedWallets, config, children }) => {
  const wallets = useMemo(() => {
    return [
      new SolanaMobileWalletAdapter({
        addressSelector: createDefaultAddressSelector(),
        appIdentity: {
          uri: config.metadata.url,
          // TODO: Icon support looks flaky
          icon: '',
          name: config.metadata.name,
        },
        authorizationResultCache: createDefaultAuthorizationResultCache(),
        cluster: config.env,
        // TODO: Check if MWA still redirects aggressively.
        onWalletNotFound: createDefaultWalletNotFoundHandler(),
      }),
      ...passedWallets,
      ...(config.hardcodedWallets || []).map((item) => new HardcodedWalletStandardAdapter(item)),
    ];
  }, []);

  return (
    <WalletProvider wallets={wallets} autoConnect={config.autoConnect} onError={noop}>
      <PreviouslyConnectedProvider>{children}</PreviouslyConnectedProvider>
    </WalletProvider>
  );
};

export default WalletConnectionProvider;
