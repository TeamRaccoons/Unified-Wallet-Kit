// Base libs
export * from '@solana/wallet-adapter-base';
export {
  WalletProvider,
  // useWallet,
  useAnchorWallet,
  useConnection,
  useLocalStorage,
  ConnectionProvider,
} from '@solana/wallet-adapter-react';

// Override useWallet to be Unified's
import { useUnifiedWallet } from './contexts/UnifiedWalletContext';
export { useUnifiedWallet as useWallet };

// Contexts
export * from './contexts/UnifiedWalletProvider';
export { default as HardcodedWalletStandardAdapter } from './contexts/WalletConnectionProvider/HardcodedWalletStandardAdapter';

// Components
export * from './components/index';

// Constants
export { HARDCODED_WALLET_STANDARDS } from './misc/constants';
