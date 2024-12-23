// This is a duplicated snippet for Codeblock generations
export const HARDCODED_DECLARTION_BLOCK = `
const wallets: Adapter[] = useMemo(() => {
  const { reownAdapter, jupiterAdapter } = useWrappedReownAdapter({
    appKitOptions: {
      metadata: {
        name: 'Your project name',
        description: 'Your project description',
        url: '', // origin must match your domain & subdomain
        icons: [''],
      },
      projectId: '<your-project-id>',
      features: {
        analytics: false,
        socials: ['google', 'x', 'apple'],
        email: false,
      },
      enableWallets: false,
    },
  });

  return [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new CoinbaseWalletAdapter(),
    new TrustWalletAdapter(),
    reownAdapter,
    jupiterAdapter
  ].filter((item) => item && item.name && item.icon) as Adapter[];
}, []);
`;

export const HARDCODED_WALLET_CODEBLOCK = `
wallets={wallets}
`
