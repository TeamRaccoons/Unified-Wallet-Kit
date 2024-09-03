import React from 'react';
import { useMemo } from 'react';
import 'twin.macro';

import { UnifiedWalletProvider } from '../../contexts/UnifiedWalletProvider';
import { UnifiedWalletButton } from '../UnifiedWalletButton';

import {
  PhantomWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
  WalletConnectWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  initialize as initializeSolflareAndMetamaskSnap,
  SolflareWalletAdapter,
} from '@solflare-wallet/wallet-adapter';
import { WalletAdapterWithMutableSupportedTransactionVersions, metadata } from './constants';
import { Adapter, BaseSignerWalletAdapter, WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import WalletNotification from './WalletNotification';
import CodeBlocks from '../CodeBlocks/CodeBlocks';
import { HARDCODED_DECLARTION_BLOCK, HARDCODED_WALLET_CODEBLOCK } from './snippets/ExampleSelectedWalletsSnippet';
import { IUnifiedTheme } from '../../contexts/UnifiedWalletContext';
import { AllLanguage } from '../../contexts/TranslationProvider/i18n';
import { UnifiedSupportedProvider } from '../../contexts/WalletConnectionProvider/providers';
import WalletSigningTestComponent from '../WalletSigningTestComponent';

initializeSolflareAndMetamaskSnap();

const ExampleSelectedWallets: React.FC<{
  theme: IUnifiedTheme;
  lang: AllLanguage;
  provider: UnifiedSupportedProvider;
}> = ({ theme, lang, provider }) => {
  const wallets: Adapter[] = useMemo(() => {
    const walletConnectWalletAdapter: WalletAdapterWithMutableSupportedTransactionVersions<BaseSignerWalletAdapter> | null =
      (() => {
        const adapter: WalletAdapterWithMutableSupportedTransactionVersions<BaseSignerWalletAdapter> =
          new WalletConnectWalletAdapter({
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
      new TrustWalletAdapter(),
      walletConnectWalletAdapter,
    ].filter((item) => item && item.name && item.icon) as Adapter[];
  }, []);

  const params: Omit<Parameters<typeof UnifiedWalletProvider>[0], 'children'> = useMemo(
    () => ({
      wallets: wallets,
      config: {
        autoConnect: false,
        env: 'mainnet-beta',
        metadata: {
          name: 'UnifiedWallet',
          description: 'UnifiedWallet',
          url: 'https://jup.ag',
          iconUrls: ['https://jup.ag/favicon.ico'],
        },
        notificationCallback: WalletNotification,
        walletlistExplanation: {
          href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
        },
        theme,
        lang,
        provider,
      },
    }),
    [wallets, theme, lang, provider],
  );

  return (
    <div tw="flex flex-col items-start">
      <UnifiedWalletProvider {...params}>
        <UnifiedWalletButton />
        <WalletSigningTestComponent />
      </UnifiedWalletProvider>

      <div tw="w-full overflow-x-auto">
        <CodeBlocks
          params={params}
          unparsedWalletDeclarationString={HARDCODED_DECLARTION_BLOCK}
          unparsedWalletPropsString={HARDCODED_WALLET_CODEBLOCK}
        />
      </div>
    </div>
  );
};

export default ExampleSelectedWallets;
