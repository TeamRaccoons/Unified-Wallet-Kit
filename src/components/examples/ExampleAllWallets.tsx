import { useMemo } from 'react';
import 'twin.macro';

import * as AllWalletAdapters from '@solana/wallet-adapter-wallets';

import { BaseSignerWalletAdapter, WalletAdapterNetwork, WalletName } from '@solana/wallet-adapter-base';
export const MWA_NOT_FOUND_ERROR = 'MWA_NOT_FOUND_ERROR';

import { UnifiedWalletButton } from '..';
import { WalletAdapterWithMutableSupportedTransactionVersions, metadata } from './constants';
import { UnifiedWalletProvider } from '../../contexts/UnifiedWalletProvider';
import WalletNotification from './WalletNotification';
import CodeBlocks from '../CodeBlocks/CodeBlocks';
import { HARDCODED_DECLARTION_BLOCK, HARDCODED_WALLET_CODEBLOCK } from './snippets/ExampleAllWalletsSnippet';
import { IUnifiedTheme } from '../../contexts/UnifiedWalletContext';
import { HARDCODED_WALLET_STANDARDS } from '../../misc/constants';
import { AllLanguage } from '../../contexts/TranslationProvider/i18n';

const ExampleAllWallets: React.FC<{ theme: IUnifiedTheme; lang: AllLanguage }> = ({ theme, lang }) => {
  const wallets = useMemo(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const { UnsafeBurnerWalletAdapter: _, WalletConnectWalletAdapter, ...allwalletAdapters } = AllWalletAdapters;

    const walletAdapters = Object.keys(allwalletAdapters)
      .filter((key) => key.includes('Adapter'))
      .map((key) => (allwalletAdapters as any)[key])
      .map((WalletAdapter: any) => new WalletAdapter()); // Intentional any, TS were being annoying

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

    return [...walletAdapters, walletConnectWalletAdapter].filter((item) => item && item.name && item.icon);
  }, [metadata]);

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
        walletPrecedence: ['OKX Wallet' as WalletName, 'WalletConnect' as WalletName],
        hardcodedWallets: HARDCODED_WALLET_STANDARDS,
        walletlistExplanation: {
          href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
        },
        theme,
        lang,
      },
    }),
    [wallets, theme, lang],
  );

  return (
    <div tw="flex flex-col items-start">
      <UnifiedWalletProvider {...params}>
        <UnifiedWalletButton />
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

export default ExampleAllWallets;
