import { useLocalStorage, useWallet } from '@solana/wallet-adapter-react';
import React, { useContext, useEffect } from 'react';

const PreviouslyConnectedContext = React.createContext<string[]>([]);

const PreviouslyConnectedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { wallet, connected } = useWallet();

  const [previouslyConnected, setPreviouslyConnected] = useLocalStorage<string[]>(
    'unified-wallet-previously-connected',
    [],
  );

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
