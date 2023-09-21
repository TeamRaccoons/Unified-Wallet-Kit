import 'twin.macro';

import { UnifiedWalletProvider } from '../../contexts/UnifiedWalletProvider';
import { UnifiedWalletButton } from '../UnifiedWalletButton';
import WalletNotification from './WalletNotification';
import CodeBlocks from '../CodeBlocks/CodeBlocks';
import { Cluster } from '@solana/web3.js';
import { useMemo } from 'react';
import { IUnifiedTheme } from '../../contexts/UnifiedWalletContext';
import { AllLanguage } from '../../contexts/TranslationProvider/i18n';

const HARDCODED_WALLET_CODEBLOCK = `wallets={[]}`;

const ExampleBaseOnly: React.FC<{ theme: IUnifiedTheme; lang: AllLanguage }> = ({ theme, lang }) => {
  const params: Omit<Parameters<typeof UnifiedWalletProvider>[0], 'children'> = useMemo(
    () => ({
      wallets: [],
      config: {
        autoConnect: false,
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
