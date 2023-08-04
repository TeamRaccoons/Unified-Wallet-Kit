import React from 'react'
import { CometKitProvider } from 'src/contexts/CometKitProvider'
import CometWalletButton from '../CometWalletButton'

const ExampleBaseOnly = () => {
  return (
    <CometKitProvider
      wallets={[]}
      passThroughWallet={null}
      config={{
        autoConnect: true,
        env: 'mainnet-beta',
        metadata: {
          name: 'CometKit',
          description: 'CometKit',
          url: 'https://jup.ag',
          iconUrls: ['https://jup.ag/favicon.ico'],
        }
      }}
    >
      <CometWalletButton />
    </CometKitProvider>
  )
}

export default ExampleBaseOnly