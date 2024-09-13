import { useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { useState } from 'react';
import { toast } from 'sonner';
import tw from 'twin.macro';
import { useUnifiedWallet } from '../UnifiedWalletContext';

const amountInLamports = Math.round(0.0001 * 10 ** 9);
export function SolanaSendTransactionTest() {
  const { publicKey, sendTransaction } = useUnifiedWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);

  async function onSendTransaction() {
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

      // Create a new transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey,
          lamports: amountInLamports,
        }),
      );
      transaction.feePayer = publicKey;

      const { blockhash } = await connection.getLatestBlockhash();

      transaction.recentBlockhash = blockhash;

      const signature = await sendTransaction(transaction, connection);

      toast.success(`Success ${signature}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function onSendVersionedTransaction() {
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

      const { blockhash } = await connection.getLatestBlockhash();

      const instructions = [
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey,
          lamports: amountInLamports,
        }),
      ];

      // Create v0 compatible message
      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      // Make a versioned transaction
      const transactionV0 = new VersionedTransaction(messageV0);

      const signature = await sendTransaction(transactionV0, connection);

      toast.success(`Success ${signature}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p css={tw`text-white text-xs mt-2 mb-1`}>Sign and Send Transaction (dApp)</p>
      <div css={tw`flex gap-4`}>
        <button data-testid="sign-transaction-button" onClick={onSendTransaction} disabled={loading} css={tw`rounded-lg py-1 px-2 text-xs bg-v2-lily/70 text-black disabled:opacity-50`}>
          Sign and Send Transaction
        </button>
        <button data-test-id="sign-transaction-button" onClick={onSendVersionedTransaction} disabled={loading} css={tw`rounded-lg py-1 px-2 text-xs bg-v2-lily/70 text-black disabled:opacity-50`}>
          Sign and Send Versioned Transaction
        </button>
      </div>
    </div>
  );
}
