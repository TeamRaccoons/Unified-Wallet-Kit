import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { useQuery, useMutation } from '@tanstack/react-query';
import { SwapQuoteResponse } from './SwapClient';
import swapClient from './SwapClient';
import { base64 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';

const SOL_MINT = 'So11111111111111111111111111111111111111112';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const USDC_DECIMALS = 6;
const SWAP_AMOUNT = 1; // USDC

// Only swap 1 USDC to SOL
export const JupiterSwap: React.FC = () => {
  const { publicKey, signTransaction, connected, wallet } = useWallet();

  const { data: quote, isLoading: quoteLoading } = useQuery({
    queryKey: ['swap-quote', publicKey?.toString()],
    queryFn: () => {
      const usdcLamports = SWAP_AMOUNT * Math.pow(10, USDC_DECIMALS);
      return swapClient.getSwapQuote(USDC_MINT, SOL_MINT, usdcLamports, publicKey?.toString() || '');
    },
    enabled: !!publicKey,
    refetchInterval: 10_000,
  });

  const { mutateAsync: swap, isPending: swapPending } = useMutation({
    mutationFn: async (quoteResponse?: SwapQuoteResponse) => {
      try {
        if (!wallet || !signTransaction) {
          throw new Error('Wallet not connected');
        }

        if (!quoteResponse) {
          throw new Error('No quote response');
        }

        const tx = quoteResponse.transaction!;
        const based64tx = base64.decode(tx);
        const versionedTransaction = VersionedTransaction.deserialize(new Uint8Array(based64tx));

        const signedTransaction = await signTransaction(versionedTransaction);
        const serializedTransaction = Buffer.from(signedTransaction.serialize()).toString('base64');

        return swapClient.swap(serializedTransaction, quoteResponse.requestId);
      } catch (error) {
        console.log({ error });
      }
    },
    onSuccess: (data) => {
      console.log({ data });
      return data;
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const formatAmount = (amount: string, decimals: number): string => {
    const value = parseInt(amount) / Math.pow(10, decimals);
    return value.toFixed(6);
  };

  return (
    <button
      onClick={() => connected && swap(quote)}
      disabled={!connected || !quote || swapPending || quoteLoading}
      css={[
        tw`inline-flex items-center gap-3 py-3 px-5`,
        tw`bg-gradient-to-r from-blue-600 to-purple-600`,
        tw`text-white rounded-full font-semibold shadow-lg`,
        tw`hover:from-blue-700 hover:to-purple-700`,
        tw`disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed`,
        tw`transition-all transform hover:scale-105 active:scale-95`,
      ]}
    >
      {connected ? (
        <>
          <div tw="flex flex-col items-start">
            <span tw="text-xs opacity-90">Swap</span>
            <span tw="text-sm font-bold">
              {quoteLoading
                ? 'Loading...'
                : `${SWAP_AMOUNT} USDC → ${quote ? formatAmount(quote.outAmount, 9) : '...'} SOL`}
            </span>
          </div>
          <div tw="ml-2">{!connected ? '🔗' : swapPending ? '⏳' : quoteLoading ? '🔄' : '→'}</div>
        </>
      ) : (
        <div tw="flex flex-col items-start">
          <span tw="text-xs opacity-90">Connect your wallet to swap</span>
        </div>
      )}
    </button>
  );
};
