// This is a duplicated snippet for Codeblock generations
export const HARDCODED_DECLARTION_BLOCK = `
const wallets: Adapter[] = React.useMemo(() => {
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

  return [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new CoinbaseWalletAdapter(),
    new BackpackWalletAdapter(),
    new GlowWalletAdapter(),
    new TrustWalletAdapter(),
    walletConnectWalletAdapter,
  ].filter((item) => item && item.name && item.icon) as Adapter[];
}, []);
`;

export const HARDCODED_WALLET_CODEBLOCK = `
wallets={wallets}
`
