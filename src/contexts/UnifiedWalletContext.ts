import type { Adapter, SendTransactionOptions, WalletName } from '@solana/wallet-adapter-base';
import type { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
import type { WalletContextState } from '@solana/wallet-adapter-react';
import { useContext } from 'react';
import { createContext } from 'react';
import { IUnifiedWalletConfig } from './WalletConnectionProvider';
import { TwStyle } from 'twin.macro';

export const MWA_NOT_FOUND_ERROR = 'MWA_NOT_FOUND_ERROR';
export type IUnifiedTheme = 'light' | 'dark' | 'jupiter';
export type IStandardStyle = Record<string, { [key in IUnifiedTheme]: TwStyle[] }>;

export interface IUnifiedWalletContext {
  walletPrecedence: IUnifiedWalletConfig['walletPrecedence'];
  handleConnectClick: (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>, wallet: Adapter) => Promise<void>;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  walletlistExplanation: IUnifiedWalletConfig['walletlistExplanation'];
  theme: IUnifiedTheme;
  walletAttachments: IUnifiedWalletConfig['walletAttachments'];
  walletModalAttachments: IUnifiedWalletConfig['walletModalAttachments'];
}

export const UnifiedWalletContext = createContext<IUnifiedWalletContext>({
  walletPrecedence: [],
  handleConnectClick: async (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>, wallet: Adapter) => {},
  showModal: false,
  setShowModal: (showModal: boolean) => {},
  walletlistExplanation: undefined,
  theme: 'light',
  walletAttachments: undefined,
  walletModalAttachments: undefined,
});

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

export const UNIFIED_WALLET_VALUE_DEFAULT_CONTEXT = {
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
    _options?: SendTransactionOptions,
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

export const UnifiedWalletValueContext = createContext<WalletContextState>(UNIFIED_WALLET_VALUE_DEFAULT_CONTEXT);

// Interal context for use within the library
export const useUnifiedWalletContext = (): IUnifiedWalletContext => {
  return useContext(UnifiedWalletContext);
};

export const useUnifiedWallet = (): WalletContextState => {
  return useContext(UnifiedWalletValueContext);
};
