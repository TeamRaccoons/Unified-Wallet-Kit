import 'twin.macro';

import { UnifiedWalletProvider } from '../../contexts/UnifiedWalletProvider';
import { UnifiedWalletButton } from '../UnifiedWalletButton';
import WalletNotification from './WalletNotification';
import CodeBlocks from '../CodeBlocks/CodeBlocks';
import { Cluster } from '@solana/web3.js';
import { useMemo } from 'react';
import { IUnifiedTheme } from '../../contexts/UnifiedWalletContext';
import { AllLanguage } from '../../contexts/TranslationProvider/i18n';
import { useReownAppKitAdapter } from 'src/customAdapters/Reown/useCustomReownAdapter';

const HARDCODED_WALLET_CODEBLOCK = `wallets={[]}`;

const ExampleBaseOnly: React.FC<{ theme: IUnifiedTheme; lang: AllLanguage }> = ({ theme, lang }) => {
  const { reownAdapter, jupiterAdapter } = useReownAppKitAdapter({
    appKitOptions: {
      metadata: {
        name: 'Jupiter',
        description: `Jupiter is one of the largest decentralized trading platform and one of the most active governance community in crypto. We're building the everything exchange for everyone.`,
        url: 'https://jup.ag', // origin must match your domain & subdomain
        icons: ['https://jup.ag/svg/jupiter-logo.png'],
      },
      projectId: '4a4e231c4004ef7b77076a87094fba61',
      features: {
        analytics: false,
        socials: ['google', 'x', 'apple'],
        email: false,
      },
      enableWallets: false,
    },
  });

  const params: Omit<Parameters<typeof UnifiedWalletProvider>[0], 'children'> = useMemo(
    () => ({
      wallets: [reownAdapter, jupiterAdapter],
      config: {
        autoConnect: true,
        env: 'mainnet-beta' as Cluster,
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
    [theme, lang],
  );

  return (
    <div tw="flex flex-col items-start">
      <UnifiedWalletProvider {...params}>
        <UnifiedWalletButton />
      </UnifiedWalletProvider>
      <div tw="w-full overflow-x-auto">
        <CodeBlocks
          params={params}
          unparsedWalletDeclarationString={''}
          unparsedWalletPropsString={HARDCODED_WALLET_CODEBLOCK}
        />
      </div>
    </div>
  );
};

export default ExampleBaseOnly;
