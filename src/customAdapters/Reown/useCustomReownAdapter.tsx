import { useEffect, useMemo } from 'react';

import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { type Provider } from '@reown/appkit-adapter-solana/react';
import { useAppKitWallet } from '@reown/appkit-wallet-button/react';
import { solana as solanaNetwork } from '@reown/appkit/networks';
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
  useAppKitState,
  useDisconnect,
} from '@reown/appkit/react';

import { CustomReownAdapter, REOWN_WALLET_NAME } from './CustomReownAdapter';
import { WalletConnectionError } from '@solana/wallet-adapter-base';

export type InitReownAppKitOptions = Omit<Parameters<typeof createAppKit>[0], 'adapters' | 'networks'> & {
  adapters?: Parameters<typeof createAppKit>[0]['adapters'];
  networks?: Parameters<typeof createAppKit>[0]['networks'];
};

function initReownAppKit({ appKitOptions }: { appKitOptions: InitReownAppKitOptions }) {
  const solanaWeb3JsAdapter = new SolanaAdapter({
    wallets: [],
  });

  const appKit = createAppKit({
    adapters: [solanaWeb3JsAdapter],
    networks: [solanaNetwork],
    ...appKitOptions,
  });
  return { solanaWeb3JsAdapter, appKit };
}

export const useReownAppKitAdapter = ({ appKitOptions }: { appKitOptions: InitReownAppKitOptions }) => {
  // Only initialize once
  useMemo(() => {
    initReownAppKit({
      appKitOptions,
    });
  }, []);

  const reownAppKit = useAppKit();
  const appKitState = useAppKitState();
  const appKitAccount = useAppKitAccount();
  const { connect: connectReown } = useAppKitWallet();
  const { walletProvider } = useAppKitProvider<Provider>('solana');
  const { disconnect: disconnectInternal } = useDisconnect();

  useEffect(() => {
    if (walletProvider && appKitAccount.isConnected) {
      CustomReownAdapter.setWalletProvider(walletProvider);
    }
  }, [walletProvider, reownAppKit, appKitState, appKitAccount]);

  const connect = async () => {
    const attemptingToReconnect = (() => {
      if (typeof window === 'undefined') return false;
      // TODO: Open sourcing this can be harder
      const found = window.localStorage.getItem('Jupiter-previous-connected');
      const foundWalletName = window.localStorage.getItem('walletName');

      try {
        if (found) {
          const parsed = JSON.parse(found);
          if (parsed && parsed[0] === REOWN_WALLET_NAME && foundWalletName?.replaceAll('"', '') === REOWN_WALLET_NAME) {
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    })();

    // Fresh connection
    if (!attemptingToReconnect) {
      reownAppKit.open(); // open the appkit modal
    }
    // else, it's an attempt to reconnect, don't show the modal

    const connectLoop = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // delay for 500ms

      const walletProvider = CustomReownAdapter.walletProvider;
      const publicKey = walletProvider?.publicKey;
      if (publicKey) {
        reownAppKit.close();
        CustomReownAdapter.setWalletProvider(walletProvider);
        return publicKey;
      }

      // Closed AppKit modal
      if (appKitState.loading === false && appKitState.open === false) {
        throw new WalletConnectionError('AppKit adapter closed', {});
      }

      return connectLoop();
    };

    return await connectLoop();
  };

  const { reownAdapter, jupiterAdapter } = useMemo(() => {
    const reownAdapter = new CustomReownAdapter({
      open: connect,
      close: reownAppKit.close,
      disconnectInternal: async () => {
        await disconnectInternal();
        CustomReownAdapter.setWalletProvider(null);
      },
    });

    const jupiterMobileProxyAdapter = new Proxy(reownAdapter, {
      get: (target, prop, receiver) => {
        switch (prop) {
          case 'name':
            return 'Jupiter Mobile';
          case 'url':
            return 'https://jup.ag/mobile';
          case 'icon':
            return 'https://jup.ag/svg/jupiter-logo.png'; // TODO: this wont work
          case 'connect':
            return async () => {
              // Pushing Jupiter connect to last tick
              setTimeout(() => {
                connectReown('jupiter');
              }, 0);

              return reownAdapter.connect();
            };

          case 'disconnect':
            return async () => {
              await reownAdapter.disconnect();
            };

          default: {
            const value = Reflect.get(target, prop, receiver);
            return value;
          }
        }
      },
    });

    return { reownAdapter, jupiterAdapter: jupiterMobileProxyAdapter };
  }, []);

  return {
    reownAdapter,
    jupiterAdapter,
  };
};
