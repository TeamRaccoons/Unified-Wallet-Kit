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

import { CustomReownAdapter } from './CustomReownAdapter';
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
      const found = window.localStorage.getItem('@appkit/connection_status');
      if (found === 'connected' || found === 'connecting') {
        return true;
      }
      return false;
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
            return 'data:image/png;base64,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' as const;
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
