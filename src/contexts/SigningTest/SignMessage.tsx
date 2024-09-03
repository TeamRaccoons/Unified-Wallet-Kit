import { useWeb3ModalProvider } from '@web3modal/solana/react';
import { useState } from 'react';
import { toast } from 'sonner';
import tw from 'twin.macro';

export function SolanaSignMessageTest() {
  const { walletProvider } = useWeb3ModalProvider();
  const [loading, setLoading] = useState(false);

  async function onSignMessage() {
    try {
      setLoading(true);

      if (!walletProvider) {
        throw Error('user is disconnected');
      }

      const encodedMessage = new TextEncoder().encode('Hello from Web3Modal');
      const signature = await walletProvider.signMessage(encodedMessage);

      toast.success(`Success ${signature}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      data-test-id="sign-transaction-button"
      onClick={onSignMessage}
      disabled={loading}
      css={tw`cursor-pointer border border-white/10 rounded-lg py-1.5 px-3 bg-white text-black disabled:opacity-50`}
    >
      Sign Message
    </button>
  );
}
