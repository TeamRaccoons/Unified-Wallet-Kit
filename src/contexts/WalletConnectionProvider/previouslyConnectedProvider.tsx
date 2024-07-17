import { useLocalStorage, useWallet } from '@solana/wallet-adapter-react';
import React, { useContext, useEffect } from 'react';

const OLD_KEY_NAME = 'open-wallet-previously-connected';
const NEW_KEY_NAME = 'unified-wallet-previously-connected';

const PreviouslyConnectedContext = React.createContext<string[]>([]);

const PreviouslyConnectedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { wallet, connected } = useWallet();

  const [oldPreviouslyConnected, setOldPreviouslyConnected] = useLocalStorage<string[]>(OLD_KEY_NAME, []);
  const [previouslyConnected, setPreviouslyConnected] = useLocalStorage<string[]>(NEW_KEY_NAME, []);

  // TODO: Remove this block after a few releases (changes made in v0.2.0)
  useEffect(() => {
    if (oldPreviouslyConnected) {
      setPreviouslyConnected(oldPreviouslyConnected);
      //@ts-ignore
      setOldPreviouslyConnected(null);
    }
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
