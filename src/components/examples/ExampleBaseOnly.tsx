import 'twin.macro';

import { UnifiedWalletProvider } from 'src/contexts/UnifiedWalletProvider';
import { UnifiedWalletButton } from '../UnifiedWalletButton';
import WalletNotification from './WalletNotification';
import CodeBlocks from '../CodeBlocks/CodeBlocks';
import { Cluster } from '@solana/web3.js';
import { useMemo } from 'react';
import { IUnifiedTheme } from 'src/contexts/UnifiedWalletContext';

const HARDCODED_WALLET_CODEBLOCK = `wallets={[]}`

const ExampleBaseOnly: React.FC<{ theme: IUnifiedTheme }> = ({ theme }) => {
  const params: Omit<Parameters<typeof UnifiedWalletProvider>[0], 'children'> = useMemo(() => ({
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
    },
  }), [theme]);

  return (
    <div tw="w-full">
      <div tw="w-[90px] md:w-[130px]">
        <UnifiedWalletProvider {...params}>
          <UnifiedWalletButton />
        </UnifiedWalletProvider>
      </div>

      <CodeBlocks params={params} unparsedWalletDeclarationString={''} unparsedWalletPropsString={HARDCODED_WALLET_CODEBLOCK} />
    </div>
  );
};

export default ExampleBaseOnly;
