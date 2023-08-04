import React, {
  useContext,
  useMemo,
} from "react";

import {
  useWallet,
  Wallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";

// import { Toaster } from 'sonner';
import { Adapter, SendTransactionOptions, WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import WalletConnectionProvider, { ICometKitConfig, ICometKitMetadata } from "./WalletConnectionProvider";
import { IHardcodedWalletStandardAdapter } from "./WalletConnectionProvider/HardcodedWalletStandardAdapter";

export const MWA_NOT_FOUND_ERROR = "MWA_NOT_FOUND_ERROR";

export type IWalletProps = Omit<WalletContextState, 'autoConnect' | 'disconnecting' | 'sendTransaction' | 'signTransaction' | 'signAllTransactions' | 'signMessage'>;

// Copied from @solana/wallet-adapter-react
function constructMissingProviderErrorMessage(action: string, valueName: string) {
  return (
    'You have tried to ' +
    ` ${action} "${valueName}"` +
    ' on a WalletContext without providing one.' +
    ' Make sure to render a WalletProvider' +
    ' as an ancestor of the component that uses ' +
    'WalletContext'
  );
}

const DEFAULT_CONTEXT = {
  autoConnect: false,
  connecting: false,
  connected: false,
  disconnecting: false,
  select(_name: WalletName | null) {
    console.error(constructMissingProviderErrorMessage('get', 'select'));
  },
  connect() {
    return Promise.reject(console.error(constructMissingProviderErrorMessage('get', 'connect')));
  },
  disconnect() {
    return Promise.reject(console.error(constructMissingProviderErrorMessage('get', 'disconnect')));
  },
  sendTransaction(
    _transaction: VersionedTransaction | Transaction,
    _connection: Connection,
    _options?: SendTransactionOptions
  ) {
    return Promise.reject(console.error(constructMissingProviderErrorMessage('get', 'sendTransaction')));
  },
  signTransaction(_transaction: Transaction) {
    return Promise.reject(console.error(constructMissingProviderErrorMessage('get', 'signTransaction')));
  },
  signAllTransactions(_transaction: Transaction[]) {
    return Promise.reject(console.error(constructMissingProviderErrorMessage('get', 'signAllTransactions')));
  },
  signMessage(_message: Uint8Array) {
    return Promise.reject(console.error(constructMissingProviderErrorMessage('get', 'signMessage')));
  },
} as WalletContextState;

export interface ICometKitContext { }



const CometKitContext = React.createContext<ICometKitContext>({});
const CometKitValueContext = React.createContext<WalletContextState>(DEFAULT_CONTEXT);

const CometKitValueProvider = ({ passThroughWallet, children }: { passThroughWallet: Wallet | null, children: React.ReactNode }) => {
  const defaultWalletContext = useWallet();

  const value = useMemo(() => {
    if (passThroughWallet) {
      return {
        ...DEFAULT_CONTEXT,
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

    return defaultWalletContext;
  }, [defaultWalletContext, passThroughWallet])

  return (
    <CometKitValueContext.Provider value={value}>
      {children}
    </CometKitValueContext.Provider>
  )
}

const CometKitProvider = ({
  passThroughWallet,
  wallets,
  config,
  hardcodedWalletStandard,
  children,
}: {
  passThroughWallet: Wallet | null;
  wallets: Adapter[];
  config: ICometKitConfig;
  hardcodedWalletStandard?: IHardcodedWalletStandardAdapter[]
  children: React.ReactNode;
}) => {
  return (
    <WalletConnectionProvider
      wallets={wallets}
      config={config}
      hardcodedWalletStandard={hardcodedWalletStandard}
    >
      <>
        {/* <Toaster position="bottom-left" toastOptions={{ className: '!bg-black !text-white !px-6 !py-5 !border-none' }} /> */}

        <CometKitContext.Provider value={{ ...passThroughWallet }}>
          <CometKitValueProvider passThroughWallet={passThroughWallet}>
            {children}
          </CometKitValueProvider>
        </CometKitContext.Provider>
      </>
    </WalletConnectionProvider>
  );
};

const useCometKit = (): WalletContextState => {
  return useContext(CometKitValueContext);
};

export { CometKitProvider, useCometKit };
