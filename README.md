# Unified Wallet Kit
<img src="public/raccoons_wallet.jpg" />

Unified Wallet Kit is an open-sourced, Swiss Army Knife wallet adapter, striving for the best wallet integration experience for developers, and best wallet experience for your users.

Used by Jupiter and Meteora.

## Philosophy
- Set a sensible defaults
- Lightweight, easy to adopt, fast to access
- Extensible wallets, with a BYOW (Bring your own wallets) approach
- Better onboarding experience for new users

## Core features
- [x] Main esm bundle at 94Kb (~20Kb gzipped)
- [x] Built-in Wallet Standard, Mobile Wallet Adapter support
- [x] Abstracted wallet adapter, with a BYOW (Bring your own wallets) approach
- [x] Mobile responsive
- [x] Notification plug-in

## Upcoming features
- [ ] Internationalization (i18n)
- [ ] Theming (from light to dark, from funky to boringly corporate)
- [ ] New user onboarding
- [ ] Even more customisation

## Getting Started
- `pnpm i @jup-ag/wallet-adapter`
- Wrap your app with `<UnifiedWalletProvider />` and pass in as little to as many wallets you would like to support.
- Below example is `ExampleBaseOnly.tsx`

```tsx
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
        walletlistExplanation: {
          href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
        }
      }}
    >
      <UnifiedWalletButton />
    </UnifiedWalletProvider>
  );
};

export default ExampleBaseOnly;
```
- More example can be found on the demo page, or in `src/components/examples`


## FAQs
- Why not ship with all wallets?
  - Unnecessary bloat and bundle size on your dApp
  - It's not sensible to always maintain an ever-growing list of wallets
  - many existing wallets are not well maintained, often with unpatched security, or abandoned development
  - lack of users
  - does not support Versioned Transaction, severely limiting the adoption of many innovative functionalities of dApp.
  - and hopefully, a gradually disappearing list of installed wallet adapter, as they migrate to wallet-standard

- Why not just use the existing wallet adapters?
  - To bootstrap a dApp, we always find ourself doing the same thing over and over again, such as:
    - notification when wallets are selected, connecting, connected, disconnected.
    - auto reconnect to the last connected wallet
    - mobile-first, responsive design
    - themeing support (coming soon)
    - Internationalization (i18n) support (coming soon)
  - And on ecosystem level
    - new user onboarding (coming soon)

- why not ship with notification by default
  - existing dApp might already have their own notification system
  - checkout `src/components/examples/WalletNotification.tsx` for an example of how to use the notification system
