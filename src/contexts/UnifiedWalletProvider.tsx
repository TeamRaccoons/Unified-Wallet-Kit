import { Dispatch, PropsWithChildren, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useWallet, Wallet, WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

import { Adapter, SendTransactionOptions, WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
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
import {
  useWeb3Modal,
  useWeb3ModalState,
  useWeb3ModalProvider,
  useWeb3ModalEvents,
  useDisconnect,
  useWeb3ModalAccount,
} from '@web3modal/solana/react';
import { UnifiedSupportedProvider } from './WalletConnectionProvider/providers';

export type IWalletProps = Omit<
  WalletContextState,
  'autoConnect' | 'disconnecting' | 'sendTransaction' | 'signTransaction' | 'signAllTransactions' | 'signMessage'
>;

const UnifiedWalletValueProvider = ({ children }: { children: React.ReactNode }) => {
  const defaultWalletContext = useWallet();
  const value: WalletContextState = useMemo(() => {
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

const UnifiedWalletValueProviderForWalletConnect = ({ children }: { children: React.ReactNode }) => {
  const wcModal = useWeb3Modal();
  const wcState = useWeb3ModalState();
  const wcProvider = useWeb3ModalProvider();
  const events = useWeb3ModalEvents();
  const wcAccount = useWeb3ModalAccount();
  const { disconnect: wcDisconnect } = useDisconnect();

  console.log({ wcModal, wcState, wcProvider, events, wcAccount });

  const defaultWalletContext = useWallet();

  const value: WalletContextState = useMemo(() => {
    const publicKey: PublicKey | null = (() => {
      if (wcAccount.address) {
        try {
          return new PublicKey(wcAccount.address);
        } catch (error) {
          return null;
        }
      }
      return null;
    })();

    return {
      ...defaultWalletContext,

      // autoConnect: false,
      // wallets: [],
      wallet: {
        adapter: {
          name: 'WalletConnect' as WalletName,
          url: 'https://walletconnect.org',
          icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE4NSIgdmlld0JveD0iMCAwIDMwMCAxODUiIHdpZHRoPSIzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTYxLjQzODU0MjkgMzYuMjU2MjYxMmM0OC45MTEyMjQxLTQ3Ljg4ODE2NjMgMTI4LjIxMTk4NzEtNDcuODg4MTY2MyAxNzcuMTIzMjA5MSAwbDUuODg2NTQ1IDUuNzYzNDE3NGMyLjQ0NTU2MSAyLjM5NDQwODEgMi40NDU1NjEgNi4yNzY1MTEyIDAgOC42NzA5MjA0bC0yMC4xMzY2OTUgMTkuNzE1NTAzYy0xLjIyMjc4MSAxLjE5NzIwNTEtMy4yMDUzIDEuMTk3MjA1MS00LjQyODA4MSAwbC04LjEwMDU4NC03LjkzMTE0NzljLTM0LjEyMTY5Mi0zMy40MDc5ODE3LTg5LjQ0Mzg4Ni0zMy40MDc5ODE3LTEyMy41NjU1Nzg4IDBsLTguNjc1MDU2MiA4LjQ5MzYwNTFjLTEuMjIyNzgxNiAxLjE5NzIwNDEtMy4yMDUzMDEgMS4xOTcyMDQxLTQuNDI4MDgwNiAwbC0yMC4xMzY2OTQ5LTE5LjcxNTUwMzFjLTIuNDQ1NTYxMi0yLjM5NDQwOTItMi40NDU1NjEyLTYuMjc2NTEyMiAwLTguNjcwOTIwNHptMjE4Ljc2Nzc5NjEgNDAuNzczNzQ0OSAxNy45MjE2OTcgMTcuNTQ2ODk3YzIuNDQ1NTQ5IDIuMzk0Mzk2OSAyLjQ0NTU2MyA2LjI3NjQ3NjkuMDAwMDMxIDguNjcwODg5OWwtODAuODEwMTcxIDc5LjEyMTEzNGMtMi40NDU1NDQgMi4zOTQ0MjYtNi40MTA1ODIgMi4zOTQ0NTMtOC44NTYxNi4wMDAwNjItLjAwMDAxLS4wMDAwMS0uMDAwMDIyLS4wMDAwMjItLjAwMDAzMi0uMDAwMDMybC01Ny4zNTQxNDMtNTYuMTU0NTcyYy0uNjExMzktLjU5ODYwMi0xLjYwMjY1LS41OTg2MDItMi4yMTQwNCAwLS4wMDAwMDQuMDAwMDA0LS4wMDAwMDcuMDAwMDA4LS4wMDAwMTEuMDAwMDExbC01Ny4zNTI5MjEyIDU2LjE1NDUzMWMtMi40NDU1MzY4IDIuMzk0NDMyLTYuNDEwNTc1NSAyLjM5NDQ3Mi04Ljg1NjE2MTIuMDAwMDg3LS4wMDAwMTQzLS4wMDAwMTQtLjAwMDAyOTYtLjAwMDAyOC0uMDAwMDQ0OS0uMDAwMDQ0bC04MC44MTI0MTk0My03OS4xMjIxODVjLTIuNDQ1NTYwMjEtMi4zOTQ0MDgtMi40NDU1NjAyMS02LjI3NjUxMTUgMC04LjY3MDkxOTdsMTcuOTIxNzI5NjMtMTcuNTQ2ODY3M2MyLjQ0NTU2MDItMi4zOTQ0MDgyIDYuNDEwNTk4OS0yLjM5NDQwODIgOC44NTYxNjAyIDBsNTcuMzU0OTc3NSA1Ni4xNTUzNTdjLjYxMTM5MDguNTk4NjAyIDEuNjAyNjQ5LjU5ODYwMiAyLjIxNDAzOTggMCAuMDAwMDA5Mi0uMDAwMDA5LjAwMDAxNzQtLjAwMDAxNy4wMDAwMjY1LS4wMDAwMjRsNTcuMzUyMTAzMS01Ni4xNTUzMzNjMi40NDU1MDUtMi4zOTQ0NjMzIDYuNDEwNTQ0LTIuMzk0NTUzMSA4Ljg1NjE2MS0uMDAwMi4wMDAwMzQuMDAwMDMzNi4wMDAwNjguMDAwMDY3My4wMDAxMDEuMDAwMTAxbDU3LjM1NDkwMiA1Ni4xNTU0MzJjLjYxMTM5LjU5ODYwMSAxLjYwMjY1LjU5ODYwMSAyLjIxNDA0IDBsNTcuMzUzOTc1LTU2LjE1NDMyNDljMi40NDU1NjEtMi4zOTQ0MDkyIDYuNDEwNTk5LTIuMzk0NDA5MiA4Ljg1NjE2IDB6IiBmaWxsPSIjM2I5OWZjIi8+PC9zdmc+',
          readyState: WalletReadyState.Loadable,
          publicKey,
          connecting: wcState.open,
          connected: Boolean(publicKey),
          supportedTransactionVersions: new Set(['legacy', 0]),
          autoConnect: async () => {},
          connect: async () => {
            try {
              await wcModal.open();
            } catch (error) {
              console.error(error);
            }
          },
          disconnect: async () => {
            try {
              wcDisconnect();
            } catch (error) {
              console.error(error);
            }
          },
          sendTransaction: async (
            transaction: Transaction | VersionedTransaction,
            connection: Connection,
            options?: SendTransactionOptions,
          ) => {
            return '';
          },
        } as any,
        readyState: WalletReadyState.Loadable,
      },
      publicKey,
      connecting: wcState.open,
      connected: Boolean(publicKey),
      disconnecting: false,
      select: async (walletName) => {
        // Not needed
      },
      connect: async () => {
        try {
          await wcModal.open();
        } catch (error) {
          console.error(error);
        }
      },
      disconnect: async () => {
        try {
          wcDisconnect();
        } catch (error) {
          console.error(error);
        }
      },
    };
  }, [wcModal, wcState, wcProvider]);

  console.log({ value });
  return <UnifiedWalletValueContext.Provider value={value}>{children}</UnifiedWalletValueContext.Provider>;
};

const UnifiedWalletContextProvider: React.FC<
  {
    provider: UnifiedSupportedProvider;
    setProvider: Dispatch<SetStateAction<UnifiedSupportedProvider>>;
    config: IUnifiedWalletConfig;
  } & PropsWithChildren
> = ({ provider, setProvider, config, children }) => {
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
        provider,
        setProvider,
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
  const [provider, setProvider] = useState<UnifiedSupportedProvider>('walletconnect');

  const UnifiedValueProvider =
    provider === 'solana-wallet-adapter' ? UnifiedWalletValueProvider : UnifiedWalletValueProviderForWalletConnect;

  return (
    <TranslationProvider lang={config.lang}>
      <WalletConnectionProvider provider={provider} setProvider={setProvider} wallets={wallets} config={config}>
        <UnifiedValueProvider>
          <UnifiedWalletContextProvider provider={provider} setProvider={setProvider} config={config}>
            {children}
          </UnifiedWalletContextProvider>
        </UnifiedValueProvider>
      </WalletConnectionProvider>
    </TranslationProvider>
  );
};

export { UnifiedWalletProvider, useUnifiedWallet, useUnifiedWalletContext };
