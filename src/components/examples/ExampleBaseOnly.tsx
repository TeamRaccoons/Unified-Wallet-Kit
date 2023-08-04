import React from 'react'
import { CometKitProvider } from 'src/contexts/CometKitProvider'
import CometWalletButton from '../CometWalletButton'
import WalletNotification from './WalletNotification'

const ExampleBaseOnly = () => {
  return (
    <CometKitProvider
      wallets={[]}
      passThroughWallet={null}
      config={{
        autoConnect: false,
        env: 'mainnet-beta',
        metadata: {
          name: 'CometKit',
          description: 'CometKit',
          url: 'https://jup.ag',
          iconUrls: ['https://jup.ag/favicon.ico'],
        },
        notificationCallback: WalletNotification
      }}
    >
      <CometWalletButton />
    </CometKitProvider>
  )
}

export default ExampleBaseOnly