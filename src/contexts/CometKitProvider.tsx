import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import { useWallet, Wallet, WalletContextState } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import { Adapter, WalletReadyState } from '@solana/wallet-adapter-base';
import WalletConnectionProvider, { ICometKitConfig } from './WalletConnectionProvider';
import { usePrevious } from 'react-use';

import { shortenAddress } from '../misc/utils';
import ModalDialog from '../components/ModalDialog';
import CometWalletModal from '../components/CometWalletModal';
import {
  CometKitValueContext,
  COMET_KIT_VALUE_DEFAULT_CONTEXT,
  useCometKit,
  CometKitContext,
  useCometContext,
} from './CometKitContext';

export type IWalletProps = Omit<
  WalletContextState,
  'autoConnect' | 'disconnecting' | 'sendTransaction' | 'signTransaction' | 'signAllTransactions' | 'signMessage'
>;

const CometKitValueProvider = ({
  passThroughWallet,
  children,
}: {
  passThroughWallet: Wallet | null;
  children: React.ReactNode;
}) => {
  const defaultWalletContext = useWallet();

  const value = useMemo(() => {
    if (passThroughWallet) {
      return {
        ...COMET_KIT_VALUE_DEFAULT_CONTEXT,
        wallets: defaultWalletContext.wallets || [],
        publicKey: passThroughWallet.adapter.publicKey,
        wallet: {
          adapter: passThroughWallet.adapter,
          readyState: WalletReadyState.Loadable,
        },
        connecting: passThroughWallet.adapter.connecting,
        connected: passThroughWallet.adapter.connected,
        disconnect: async () => {
          try {
            if (passThroughWallet?.adapter.disconnect) {
              return passThroughWallet?.adapter.disconnect();
            }
          } catch (error) {
            console.log(error);
          }
        },
      };
    }

    return {
      ...defaultWalletContext,
      connect: async () => {
        try {
          return await defaultWalletContext.connect();
        } catch (error) {
          // when wallet is not installed
        }
      },
    };
  }, [defaultWalletContext, passThroughWallet]);

  return <CometKitValueContext.Provider value={value}>{children}</CometKitValueContext.Provider>;
};

const CometKitContextProvider: React.FC<
  {
    config: ICometKitConfig;
    passThroughWallet: Wallet | null;
  } & PropsWithChildren
> = ({ config, passThroughWallet, children }) => {
  const { publicKey, wallet, select, connect } = useCometKit();
  const previousPublicKey = usePrevious<PublicKey | null>(publicKey);
  const previousWallet = usePrevious<Wallet | null>(wallet);

  // Weird quirks for autoConnect to require select and connect
  const [nonAutoConnectAttempt, setNonAutoConnectAttempt] = useState(false);
  useEffect(() => {
    if (nonAutoConnectAttempt && !config.autoConnect && wallet?.adapter.name) {
      try {
        connect();
      } catch (error) {
        // when wallet is not installed
      }
      setNonAutoConnectAttempt(false);
    }
  }, [nonAutoConnectAttempt, wallet?.adapter.name]);

  const [showModal, setShowModal] = useState(false);

  const handleConnectClick = useCallback(
    async (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>, adapter: Adapter) => {
      event.preventDefault();

      try {
        setShowModal(false);

        // Connecting
        config.notificationCallback?.onConnecting({
          publicKey: '',
          shortAddress: '',
          walletName: adapter.name,
          metadata: {
            name: adapter.name,
            url: adapter.url,
            icon: adapter.icon,
            supportedTransactionVersions: adapter.supportedTransactionVersions,
          },
        });

        // Might throw WalletReadyState.WalletNotReady
        select(adapter.name);

        // Weird quirks for autoConnect to require select and connect
        if (!config.autoConnect) {
          setNonAutoConnectAttempt(true);
        }

        if (adapter.readyState === WalletReadyState.NotDetected) {
          throw WalletReadyState.NotDetected;
        }
      } catch (error) {
        console.log(error);

        // Not Installed
        config.notificationCallback?.onNotInstalled({
          publicKey: '',
          shortAddress: '',
          walletName: adapter.name,
          metadata: {
            name: adapter.name,
            url: adapter.url,
            icon: adapter.icon,
            supportedTransactionVersions: adapter.supportedTransactionVersions,
          },
        });
      }
    },
    [select, connect, wallet?.adapter.name],
  );

  useEffect(() => {
    // Disconnected
    if (previousWallet && !wallet) {
      config.notificationCallback?.onDisconnect({
        publicKey: previousPublicKey?.toString() || '',
        shortAddress: shortenAddress(previousPublicKey?.toString() || ''),
        walletName: previousWallet?.adapter.name || '',
        metadata: {
          name: previousWallet?.adapter.name,
          url: previousWallet?.adapter.url,
          icon: previousWallet?.adapter.icon,
          supportedTransactionVersions: previousWallet?.adapter.supportedTransactionVersions,
        },
      });
      return;
    }

    // Connected
    if (publicKey && wallet) {
      config.notificationCallback?.onConnect({
        publicKey: publicKey.toString(),
        shortAddress: shortenAddress(publicKey.toString()),
        walletName: wallet.adapter.name,
        metadata: {
          name: wallet.adapter.name,
          url: wallet.adapter.url,
          icon: wallet.adapter.icon,
          supportedTransactionVersions: wallet.adapter.supportedTransactionVersions,
        },
      });
      return;
    }
  }, [wallet, publicKey, previousWallet]);

  return (
    <CometKitContext.Provider
      value={{
        ...passThroughWallet,
        walletPrecedence: config.walletPrecedence || [],
        handleConnectClick,
        showModal,
        setShowModal,
      }}
    >
      <ModalDialog open={showModal} onClose={() => setShowModal(false)}>
        <CometWalletModal onClose={() => setShowModal(false)} />
      </ModalDialog>

      {children}
    </CometKitContext.Provider>
  );
};

const CometKitProvider = ({
  passThroughWallet,
  wallets,
  config,
  children,
}: {
  passThroughWallet: Wallet | null;
  wallets: Adapter[];
  config: ICometKitConfig;
  children: React.ReactNode;
}) => {
  return (
    <WalletConnectionProvider wallets={wallets} config={config}>
      <CometKitValueProvider passThroughWallet={passThroughWallet}>
        <CometKitContextProvider config={config} passThroughWallet={passThroughWallet}>
          {children}
        </CometKitContextProvider>
      </CometKitValueProvider>
    </WalletConnectionProvider>
  );
};

export { CometKitProvider, useCometKit, useCometContext };
