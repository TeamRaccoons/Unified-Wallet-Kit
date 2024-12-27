import React from 'react';
import { useMemo } from 'react';
import 'twin.macro';

import { UnifiedWalletProvider } from '../../contexts/UnifiedWalletProvider';
import { UnifiedWalletButton } from '../UnifiedWalletButton';

import {
  PhantomWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  initialize as initializeSolflareAndMetamaskSnap,
  SolflareWalletAdapter,
} from '@solflare-wallet/wallet-adapter';
import { Adapter } from '@solana/wallet-adapter-base';
import WalletNotification from './WalletNotification';
import CodeBlocks from '../CodeBlocks/CodeBlocks';
import { HARDCODED_DECLARTION_BLOCK, HARDCODED_WALLET_CODEBLOCK } from './snippets/ExampleSelectedWalletsSnippet';
import { IUnifiedTheme } from '../../contexts/UnifiedWalletContext';
import { AllLanguage } from '../../contexts/TranslationProvider/i18n';
import { useWrappedReownAdapter } from '@jup-ag/jup-mobile-adapter';

initializeSolflareAndMetamaskSnap();

const ExampleSelectedWallets: React.FC<{ theme: IUnifiedTheme; lang: AllLanguage }> = ({ theme, lang }) => {
  const { reownAdapter, jupiterAdapter } = useWrappedReownAdapter({
    appKitOptions: {
      metadata: {
        name: 'Jupiter',
        description: `Jupiter is one of the largest decentralized trading platform and one of the most active governance community in crypto. We're building the everything exchange for everyone.`,
        url: 'https://jup.ag', // origin must match your domain & subdomain
        icons: ['https://jup.ag/svg/jupiter-logo.png'],
      },
      projectId: '4a4e231c4004ef7b77076a87094fba61', // Fill in your project id
      features: {
        analytics: false,
        socials: ['google', 'x', 'apple'],
        email: false,
      },
      enableWallets: false,
    },
  });

  const wallets: Adapter[] = useMemo(() => {
    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TrustWalletAdapter(),
      reownAdapter,
      jupiterAdapter
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

export default ExampleSelectedWallets;
