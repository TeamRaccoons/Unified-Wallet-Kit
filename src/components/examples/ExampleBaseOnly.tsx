import React from 'react';
import { UnifiedWalletProvider } from 'src/contexts/UnifiedWalletProvider';
import { UnifiedWalletButton } from '../UnifiedWalletButton';
import WalletNotification from './WalletNotification';

const ExampleBaseOnly = () => {
  return (
    <UnifiedWalletProvider
      wallets={[]}
      passThroughWallet={null}
      config={{
        autoConnect: false,
        env: 'mainnet-beta',
        metadata: {
          name: 'UnifiedWallet',
          description: 'UnifiedWallet',
          url: 'https://jup.ag',
          iconUrls: ['https://jup.ag/favicon.ico'],
        },
        notificationCallback: WalletNotification,
      }}
    >
      <UnifiedWalletButton />
    </UnifiedWalletProvider>
  );
};

export default ExampleBaseOnly;
