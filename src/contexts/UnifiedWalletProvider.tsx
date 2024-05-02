import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import { useWallet, Wallet, WalletContextState } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import { Adapter, WalletReadyState } from '@solana/wallet-adapter-base';
import WalletConnectionProvider, { IUnifiedWalletConfig } from './WalletConnectionProvider';
import { usePrevious } from 'react-use';

import { shortenAddress } from '../misc/utils';
import ModalDialog from '../components/ModalDialog';
import UnifiedWalletModal from '../components/UnifiedWalletModal';
import {
  UnifiedWalletValueContext,
  UNIFIED_WALLET_VALUE_DEFAULT_CONTEXT,
  useUnifiedWallet,
  UnifiedWalletContext,
  useUnifiedWalletContext,
} from './UnifiedWalletContext';
import { TranslationProvider } from './TranslationProvider';

export type IWalletProps = Omit<
  WalletContextState,
  'autoConnect' | 'disconnecting' | 'sendTransaction' | 'signTransaction' | 'signAllTransactions' | 'signMessage'
>;

const UnifiedWalletValueProvider = ({ children }: { children: React.ReactNode }) => {
  const defaultWalletContext = useWallet();

  const value = useMemo(() => {
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
  }, [defaultWalletContext]);

  return <UnifiedWalletValueContext.Provider value={value}>{children}</UnifiedWalletValueContext.Provider>;
};

const UnifiedWalletContextProvider: React.FC<
  {
    config: IUnifiedWalletConfig;
  } & PropsWithChildren
> = ({ config, children }) => {
  const { publicKey, wallet, select, connect } = useUnifiedWallet();
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
    <UnifiedWalletContext.Provider
      value={{
        walletPrecedence: config.walletPrecedence || [],
        handleConnectClick,
        showModal,
        setShowModal,
        walletlistExplanation: config.walletlistExplanation,
        theme: config.theme || 'light',
        walletAttachments: config.walletAttachments || {},
        walletModalAttachments: config.walletModalAttachments || {},
      }}
    >
      <ModalDialog open={showModal} onClose={() => setShowModal(false)}>
        <UnifiedWalletModal onClose={() => setShowModal(false)} />
      </ModalDialog>

      {children}
    </UnifiedWalletContext.Provider>
  );
};

const UnifiedWalletProvider = ({
  wallets,
  config,
  children,
}: {
  wallets: Adapter[];
  config: IUnifiedWalletConfig;
  children: React.ReactNode;
}) => {
  return (
    <TranslationProvider lang={config.lang}>
      <WalletConnectionProvider wallets={wallets} config={config}>
        <UnifiedWalletValueProvider>
          <UnifiedWalletContextProvider config={config}>{children}</UnifiedWalletContextProvider>
        </UnifiedWalletValueProvider>
      </WalletConnectionProvider>
    </TranslationProvider>
  );
};

export { UnifiedWalletProvider, useUnifiedWallet, useUnifiedWalletContext };
