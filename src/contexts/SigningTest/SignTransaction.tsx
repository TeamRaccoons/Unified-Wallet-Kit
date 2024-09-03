import { useState } from 'react';
import { PublicKey, Transaction, TransactionMessage, VersionedTransaction, SystemProgram } from '@solana/web3.js';
import { toast } from 'sonner';
import { useWeb3ModalProvider } from '@web3modal/solana/react';
import bs58 from 'bs58';
import tw from 'twin.macro';

const PHANTOM_DEVNET_ADDRESS = '8vCyX7oB6Pc3pbWMGYYZF5pbSnAdQ7Gyr32JqxqCy8ZR';
const recipientAddress = new PublicKey(PHANTOM_DEVNET_ADDRESS);
const amountInLamports = 1_000;

export function SolanaSignTransactionTest() {
  const { walletProvider, connection } = useWeb3ModalProvider();
  const [loading, setLoading] = useState(false);

  async function onSignTransaction() {
    try {
      setLoading(true);
      if (!walletProvider?.publicKey) {
        throw Error('user is disconnected');
      }

      // Create a new transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: walletProvider.publicKey,
          toPubkey: walletProvider.publicKey,
          lamports: amountInLamports,
        }),
      );
      transaction.feePayer = walletProvider.publicKey;

      if (!connection) {
        throw Error('no connection set');
      }
      const { blockhash } = await connection.getLatestBlockhash();

      transaction.recentBlockhash = blockhash;

      const signedTransaction = await walletProvider.signTransaction(transaction);
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
      if (!walletProvider?.publicKey) {
        throw Error('user is disconnected');
      }

      if (!connection) {
        throw Error('no connection set');
      }
      const { blockhash } = await connection.getLatestBlockhash();
      const instructions = [
        SystemProgram.transfer({
          fromPubkey: walletProvider.publicKey,
          toPubkey: recipientAddress,
          lamports: amountInLamports,
        }),
      ];

      // Create v0 compatible message
      const messageV0 = new TransactionMessage({
        payerKey: walletProvider.publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      // Make a versioned transaction
      const transactionV0 = new VersionedTransaction(messageV0);

      const signedTransaction = await walletProvider.signTransaction(transactionV0);
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
    <div tw="flex gap-x-4">
      <button
        data-testid="sign-transaction-button"
        onClick={onSignTransaction}
        disabled={loading}
        css={tw`cursor-pointer border border-white/10 rounded-lg py-1.5 px-3 bg-white text-black disabled:opacity-50`}
      >
        Sign Transaction
      </button>
      <button
        data-test-id="sign-transaction-button"
        onClick={onSignVersionedTransaction}
        disabled={loading}
        css={tw`cursor-pointer border border-white/10 rounded-lg py-1.5 px-3 bg-white text-black disabled:opacity-50`}
      >
        Sign Versioned Transaction
      </button>
    </div>
  );
}
