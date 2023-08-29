import { BaseWalletAdapter } from "@solana/wallet-adapter-base";

export const metadata = {
  name: 'UnifiedWallet',
  description: 'UnifiedWallet',
  url: 'https://jup.ag',
  iconUrls: ['https://jup.ag/favicon.ico'],
  additionalInfo: '',
  walletConnectProjectId: '4a4e231c4004ef7b77076a87094fba61',
}

export type WalletAdapterWithMutableSupportedTransactionVersions<T> = Omit<T, 'supportedTransactionVersions'> & {
  supportedTransactionVersions: BaseWalletAdapter['supportedTransactionVersions'];
};