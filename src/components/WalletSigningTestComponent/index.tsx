import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { SolanaSignMessageTest } from '../../contexts/SigningTest/SignMessage';
import { SolanaSignTransactionTest } from '../../contexts/SigningTest/SignTransaction';
import { SolanaSendTransactionTest } from '../../contexts/SigningTest/SolanaSendTransactionTest';
import { SolanaSignAndSendTransactionTest } from '../../contexts/SigningTest/SolanaSignAndSendTransactionTest';
import ChevronDownIcon from '../../icons/ChevronDownIcon';
import ChevronUpIcon from '../../icons/ChevronUpIcon';
import tw from 'twin.macro';
import Collapse from '../Collapse';

const WalletSigningTestComponent = () => {
  const [rpc, setRpc] = useState('https://api.mainnet-beta.solana.com/');
  const [expanded, setExpanded] = useState(false);

  return (
    <div css={tw`flex flex-col w-full`}>
      <div tw="w-full text-white font-semibold">
        <button
          type="button"
          tw="w-full text-sm text-white p-2 opacity-50 hover:opacity-100"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? `Hide Signing test` : `Show Signing test`}
          {expanded ? <ChevronUpIcon tw="inline-block ml-2" /> : <ChevronDownIcon tw="inline-block ml-2" />}
        </button>
      </div>

      <ConnectionProvider endpoint={rpc}>
        <Collapse height={0} maxHeight={'auto'} expanded={expanded}>
          <div className="flex gap-2">
            <input
              value={rpc}
              onChange={(e) => {
                setRpc(e.target.value);
              }}
              css={tw`mt-2 w-full p-2 border border-gray-300 rounded-md`}
              type="text"
            />

            <SolanaSignMessageTest />
            <SolanaSignTransactionTest />
            <SolanaSendTransactionTest />
            <SolanaSignAndSendTransactionTest />
          </div>
        </Collapse>
      </ConnectionProvider>
    </div>
  );
};

export default WalletSigningTestComponent;
