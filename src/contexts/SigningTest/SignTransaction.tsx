import { useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { useState } from 'react';
import { toast } from 'sonner';
import tw from 'twin.macro';
import { useUnifiedWallet } from '../UnifiedWalletContext';

const amountInLamports = Math.round(0.0001 * 10 ** 9);
export function SolanaSignTransactionTest() {
  const { publicKey, signTransaction } = useUnifiedWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);

  async function onSignTransaction() {
    try {
      setLoading(true);
      if (!publicKey) {
        throw Error('user is disconnected');
      }

      if (!signTransaction) {
        throw Error('signTransaction not found');
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

      if (!connection) {
        throw Error('no connection set');
      }
      const { blockhash } = await connection.getLatestBlockhash();

      transaction.recentBlockhash = blockhash;

      const signedTransaction = await signTransaction(transaction);
      const signature = signedTransaction.signatures[0]?.signature;

      if (!signature) {
        throw Error('Empty signature');
      }

      toast.success(`Success ${bs58.encode(signature)}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function onSignVersionedTransaction() {
    try {
      setLoading(true);
      if (!publicKey) {
        throw Error('user is disconnected');
      }
      if (!signTransaction) {
        throw Error('signTransaction not found');
      }

      if (!connection) {
        throw Error('no connection set');
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

      const signedTransaction = await signTransaction(transactionV0);
      const signature = signedTransaction.signatures[0];

      if (!signature) {
        throw Error('Empty signature');
      }

      toast.success(`Success ${bs58.encode(signature)}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p css={tw`text-white text-xs mt-2 mb-1`}>Sign transaction</p>
      <div tw="flex gap-x-4">
        <button
          data-testid="sign-transaction-button"
          onClick={onSignTransaction}
          disabled={loading}
          css={tw`rounded-lg py-1 px-2 text-xs bg-v2-lily/70 text-black disabled:opacity-50`}
        >
          Sign Transaction
        </button>
        <button
          data-test-id="sign-transaction-button"
          onClick={onSignVersionedTransaction}
          disabled={loading}
          css={tw`rounded-lg py-1 px-2 text-xs bg-v2-lily/70 text-black disabled:opacity-50`}
        >
          Sign Versioned Transaction
        </button>
      </div>
    </div>
  );
}
