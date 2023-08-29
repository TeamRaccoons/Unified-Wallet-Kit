// This is a duplicated snippet for Codeblock generations
export const HARDCODED_DECLARTION_BLOCK = `
const wallets = useMemo(() => {
  if (typeof window === 'undefined') {
    return [];
  }

  const { UnsafeBurnerWalletAdapter: _, WalletConnectWalletAdapter, ...allwalletAdapters } = AllWalletAdapters;

  const walletAdapters = Object.keys(allwalletAdapters)
    .filter((key) => key.includes('Adapter'))
    .map((key) => (allwalletAdapters as any)[key])
    .map((WalletAdapter: any) => new WalletAdapter()); // Intentional any, TS were being annoying

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

  return [...walletAdapters, walletConnectWalletAdapter].filter((item) => item && item.name && item.icon);
}, [metadata]);
`;

export const HARDCODED_WALLET_CODEBLOCK = `
wallets={wallets}
`
