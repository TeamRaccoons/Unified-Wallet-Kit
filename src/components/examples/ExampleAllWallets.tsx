import { useMemo } from 'react';

import * as AllWalletAdapters from '@solana/wallet-adapter-wallets';

import { BaseSignerWalletAdapter, WalletAdapterNetwork, WalletName } from '@solana/wallet-adapter-base';
export const MWA_NOT_FOUND_ERROR = 'MWA_NOT_FOUND_ERROR'

import { UnifiedWalletButton } from '..';
import { WalletAdapterWithMutableSupportedTransactionVersions, metadata } from './constants';
import { UnifiedWalletProvider } from 'src/contexts/UnifiedWalletProvider';
import WalletNotification from './WalletNotification';

export const HARDCODED_WALLET_STANDARDS: { id: string; name: WalletName; url: string; icon: string }[] = [
  {
    id: 'OKX Wallet',
    name: 'OKX Wallet' as WalletName,
    url: 'https://www.okx.com/web3',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJDSURBVHgB7Zq9jtpAEMfHlhEgQLiioXEkoAGECwoKxMcTRHmC5E3IoyRPkPAEkI7unJYmTgEFTYwA8a3NTKScLnCHN6c9r1e3P2llWQy7M/s1Gv1twCP0ej37dDq9x+Zut1t3t9vZjDEHIiSRSPg4ZpDL5fxkMvn1cDh8m0wmfugfO53OoFQq/crn8wxfY9EymQyrVCqMfHvScZx1p9ls3pFxXBy/bKlUipGPrVbLuQqAfsCliq3zl0H84zwtjQrOw4Mt1W63P5LvBm2d+Xz+YzqdgkqUy+WgWCy+Mc/nc282m4FqLBYL+3g8fjDxenq72WxANZbLJeA13zDX67UDioL5ybXwafMYu64Ltn3bdDweQ5R97fd7GyhBQMipx4POeEDHIu2LfDdBIGGz+hJ9CQ1ABjoA2egAZPM6AgiCAEQhsi/C4jHyPA/6/f5NG3Ks2+3CYDC4aTccDrn6ojG54MnEvG00GoVmWLIRNZ7wTCwDHYBsdACy0QHIhiuRETxlICWpMMhGZHmqS8qH6JLyGegAZKMDkI0uKf8X4SWlaZo+Pp1bRrwlJU8ZKLIvUjKh0WiQ3sRUbNVq9c5Ebew7KEo2m/1p4jJ4qAmDaqDQBzj5XyiAT4VCQezJigAU+IDU+z8vJFnGWeC+bKQV/5VZ71FV6L7PA3gg3tXrdQ+DgLhC+75Wq3no69P3MC0NFQpx2lL04Ql9gHK1bRDjsSBIvScBnDTk1WrlGIZBorIDEYJj+rhdgnQ67VmWRe0zlplXl81vcyEt0rSoYDUAAAAASUVORK5CYII=',
  },
  {
    id: 'Frontier',
    name: 'Frontier' as WalletName,
    url: 'https://www.frontier.xyz/ ',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iMzAiIGZpbGw9IiNDQzcwM0MiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00NiAxMkw0NS43ODIgMTIuNTI3OEw0NS4wNjQ3IDE0LjIxNjZMNDQuNTg4NSAxNS4zMDU2QzQwLjk3MjYgMjMuNDY3OSAzOC4xNTk2IDI3LjM0MTggMzUuMTY5NyAyNy4zNDE4QzMzLjQ0NjUgMjcuMzQxOCAzMi40MjY3IDI2Ljg4ODYgMzEuMTA2NCAyNS44MjVMMzAuNzI1MyAyNS41MDkyQzI5Ljc3NTQgMjQuNzA5OCAyOS4zNzUzIDI0LjUxMzMgMjguNDYxNiAyNC41MTMzQzI3Ljk4NTIgMjQuNTEzMyAyNy4xMzMgMjUuMDY5NyAyNi4wNTQ3IDI2LjM2ODVDMjQuOTM2MyAyNy43MTUyIDIzLjcxIDI5LjcwNDkgMjIuMzkyIDMyLjMyNTZMMjIuMjY5MyAzMi41NzA5TDM1LjA5NyAzMi41NzE0TDMzLjQ5OTggMzUuNTkyOUgyMS41MjExVjQ4SDE4VjEySDQ2Wk00MS4wMDg3IDE1LjAyMjVMMjEuNTIwOSAxNS4wMjE0VjI3LjAxOTJDMjMuODU1OCAyMy4zMjY1IDI2LjA3NDUgMjEuNDcyNiAyOC40NjE2IDIxLjQ3MjZDMzAuMzE3NCAyMS40NzI2IDMxLjQxMDkgMjEuOTQ5IDMyLjc5MDUgMjMuMDU3OEwzMy4xODQxIDIzLjM4MzZDMzQuMDcxIDI0LjEyOTkgMzQuNDEyOCAyNC4zMDExIDM1LjE2OTcgMjQuMzAxMUMzNi4wMDY2IDI0LjMwMTEgMzguMjIyOSAyMS4wOTM5IDQxLjAwODcgMTUuMDIyNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
  },
];

const ExampleAllWallets = () => {
  const wallets = useMemo(() => {
    if (typeof window === 'undefined') {
      return []
    }

    const {
      UnsafeBurnerWalletAdapter: _,
      WalletConnectWalletAdapter,
      ...allwalletAdapters
    } = AllWalletAdapters

    const walletAdapters = Object.keys(allwalletAdapters)
      .filter(key => key.includes('Adapter'))
      .map(key => (allwalletAdapters as any)[key])
      .map((WalletAdapter: any) => new WalletAdapter()) // Intentional any, TS were being annoying

    const walletConnectWalletAdapter: WalletAdapterWithMutableSupportedTransactionVersions<BaseSignerWalletAdapter> | null = (() => {
      const adapter: WalletAdapterWithMutableSupportedTransactionVersions<BaseSignerWalletAdapter> = new WalletConnectWalletAdapter({
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
    })()

    return [
      ...walletAdapters,
      walletConnectWalletAdapter,
    ].filter(item => item && item.name && item.icon)
  }, [metadata])

  return (
    <UnifiedWalletProvider
      wallets={wallets}
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
        walletPrecedence: [
          'OKX Wallet' as WalletName,
          'WalletConnect' as WalletName,
        ],
        hardcodedWallets: HARDCODED_WALLET_STANDARDS
      }}
    >
      <UnifiedWalletButton />
    </UnifiedWalletProvider>
  )
}

export default ExampleAllWallets