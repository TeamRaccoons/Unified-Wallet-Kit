import { useLocalStorage, useWallet } from '@solana/wallet-adapter-react';
import React, { useContext, useEffect } from 'react';

const OLD_KEY_NAME = 'open-wallet-previously-connected';
const NEW_KEY_NAME = 'unified-wallet-previously-connected';

const migrateLocalStorageKey = () => {
  // Check if data exists under the old key
  const existingData = localStorage.getItem(OLD_KEY_NAME);
  if (existingData) {
    // Move data to the new key
    localStorage.setItem(NEW_KEY_NAME, existingData);
    // Clean Up - Remove data under the old key
    localStorage.removeItem(OLD_KEY_NAME);
  }
};

const PreviouslyConnectedContext = React.createContext<string[]>([]);

const PreviouslyConnectedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { wallet, connected } = useWallet();

  const [previouslyConnected, setPreviouslyConnected] = useLocalStorage<string[]>(NEW_KEY_NAME, []);

  // TODO: Remove this block after a few releases (changes made in v0.2.0)
  useEffect(() => {
    migrateLocalStorageKey();
  }, []);

  useEffect(() => {
    if (connected && wallet) {
      // make sure the most recently connected wallet is first
      const combined = new Set([wallet.adapter.name, ...previouslyConnected]);
      setPreviouslyConnected([...combined]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, connected]);

  return (
    <PreviouslyConnectedContext.Provider value={previouslyConnected}>{children}</PreviouslyConnectedContext.Provider>
  );
};

const usePreviouslyConnected = () => {
  return useContext(PreviouslyConnectedContext);
};

export { PreviouslyConnectedProvider, usePreviouslyConnected };
export default PreviouslyConnectedContext;
