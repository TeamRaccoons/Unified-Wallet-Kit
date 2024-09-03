import { useState } from 'react';
import { toast } from 'sonner';
import tw from 'twin.macro';
import { useUnifiedWallet } from '../UnifiedWalletContext';

export function SolanaSignMessageTest() {
  const { publicKey, signMessage } = useUnifiedWallet();
  const [loading, setLoading] = useState(false);

  async function onSignMessage() {
    try {
      setLoading(true);

      if (!publicKey) {
        throw Error('user is disconnected');
      }

      if (!signMessage) {
        throw Error('signMessage is not found');
      }

      const encodedMessage = new TextEncoder().encode('Hello from Web3Modal');
      const signature = await signMessage(encodedMessage);

      toast.success(`Success ${signature}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p css={tw`text-white text-xs mt-2 mb-1`}>Sign Message</p>
      <button
        data-test-id="sign-transaction-button"
        onClick={onSignMessage}
        disabled={loading}
        css={tw`rounded-lg py-1 px-2 text-xs bg-v2-lily/70 text-black disabled:opacity-50`}
      >
        Sign Message
      </button>
    </div>
  );
}
