# Unified Wallet Kit
Unified Wallet Kit is an open-sourced, Swiss Army Knife wallet adapter, striving for the best wallet integration experience for developers, and best wallet experience for your users.

# Philosophy
- Set a sensible defaults
- Lightweight, easy to adopt, fast to access
- Extensible wallets, with a BYOW (Bring your own wallets) approach

## Core features
- [x] Main esm bundle at 94Kb (~20Kb gzipped)
- [x] Built-in Wallet Standard, Mobile Wallet Adapter support
- [x] Abstracted wallet adapter, with a BYOW (Bring your own wallets) approach
- [x] Mobile responsive
- [x] Notification plug-in

## Upcoming features
- [ ] Internationalization (i18n)
- [ ] Theming (from light to dark, from funky to boringly corporate)
- [ ] Even more customisation

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

- why not ship with notification by default
  - existing dApp might already have their own notification system
  - checkout `src/components/examples/WalletNotification.tsx` for an example of how to use the notification system
