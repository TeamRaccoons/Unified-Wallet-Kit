import { useState } from 'react';
import { Transaction, SystemProgram, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { toast } from 'sonner';
import tw from 'twin.macro';
import { useUnifiedWallet } from '../UnifiedWalletContext';
import { useConnection } from '@solana/wallet-adapter-react';

const amountInLamports = Math.round(0.0001 * 10 ** 9);
export function SolanaSignAndSendTransactionTest() {
  const { publicKey, sendTransaction } = useUnifiedWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);

  async function onSendTransaction(mode: 'legacy' | 'versioned') {
    try {
      setLoading(true);
      if (!publicKey) {
        throw Error('user is disconnected');
      }

      if (!connection) {
        throw Error('no connection set');
      }

      const balance = await connection.getBalance(publicKey);
      if (balance < amountInLamports) {
        throw Error('Not enough SOL in wallet');
      }

      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: publicKey,
        lamports: amountInLamports,
      });
      const { blockhash } = await connection.getLatestBlockhash();

      let signature = '';

      if (mode === 'versioned') {
        // Create v0 compatible message
        const messageV0 = new TransactionMessage({
          payerKey: publicKey,
          recentBlockhash: blockhash,
          instructions: [instruction],
        }).compileToV0Message();

        // Make a versioned transaction
        const versionedTranasction = new VersionedTransaction(messageV0);

        signature = await sendTransaction(versionedTranasction, connection);
      } else {
        // Create a new transaction
        const transaction = new Transaction().add(instruction);
        transaction.feePayer = publicKey;
        transaction.recentBlockhash = blockhash;
        signature = await sendTransaction(transaction, connection);
      }

      toast.success(`Success ${signature}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p css={tw`text-white text-xs mt-2 mb-1`}>Sign and Send Transaction (Wallet)</p>
      <div css={tw`flex gap-4`}>
        <button onClick={() => onSendTransaction('legacy')} disabled={loading} css={tw`rounded-lg py-1 px-2 text-xs bg-v2-lily/70 text-black disabled:opacity-50`}>
          Sign and Send Transaction
        </button>
        <button onClick={() => onSendTransaction('versioned')} disabled={loading} css={tw`rounded-lg py-1 px-2 text-xs bg-v2-lily/70 text-black disabled:opacity-50`}>
          Sign and Send Versioned Transaction
        </button>
      </div>
    </div>
  );
}
