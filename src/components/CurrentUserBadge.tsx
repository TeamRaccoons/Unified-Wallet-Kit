import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import 'twin.macro';

import { shortenAddress } from '../misc/utils';

export const CurrentUserBadge: React.FC<{ onClick?: () => void; className?: string }> = ({ onClick, className }) => {
  const { wallet, publicKey } = useWallet();

  if (!wallet || !publicKey) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      tw="flex items-center bg-[#191B1F] py-2 px-3 rounded-2xl h-7 cursor-pointer"
      className={className}
    >
      <span
        tw="w-4 h-4 rounded-full bg-[#191B1F] dark:bg-white/10 flex justify-center items-center"
        style={{ position: 'relative' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Wallet logo" width={16} height={16} src={wallet?.adapter?.icon} />
      </span>

      <span tw="ml-2 text-xs text-white">{shortenAddress(`${publicKey}`)}</span>
    </button>
  );
};
