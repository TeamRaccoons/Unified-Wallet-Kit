import { useMemo } from 'react';
import 'twin.macro';

import { UnifiedWalletProvider } from 'src/contexts/UnifiedWalletProvider';
import { UnifiedWalletButton } from '../UnifiedWalletButton';

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
  WalletConnectWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletAdapterWithMutableSupportedTransactionVersions, metadata } from './constants';
import { Adapter, BaseSignerWalletAdapter, WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import WalletNotification from './WalletNotification';
import CodeBlocks from '../CodeBlocks/CodeBlocks';
import { HARDCODED_DECLARTION_BLOCK, HARDCODED_WALLET_CODEBLOCK } from './snippets/ExampleSelectedWalletsSnippet';

const ExampleSelectedWallets = () => {
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
        theme: 'dark',
      },
    }),
    [wallets],
  );

  return (
    <div tw="w-full">
      <div tw="w-[90px] md:w-[130px]">
        <UnifiedWalletProvider {...params}>
          <UnifiedWalletButton />
        </UnifiedWalletProvider>
      </div>

      <CodeBlocks params={params} unparsedWalletDeclarationString={HARDCODED_DECLARTION_BLOCK} unparsedWalletPropsString={HARDCODED_WALLET_CODEBLOCK} />
    </div>
  );
};

export default ExampleSelectedWallets;
