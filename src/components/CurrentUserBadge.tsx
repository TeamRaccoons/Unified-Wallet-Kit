import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import 'twin.macro';

import { shortenAddress } from '../misc/utils';
import tw from 'twin.macro';
import { IStandardStyle, useUnifiedWalletContext } from '../contexts/UnifiedWalletContext';

const styles: IStandardStyle = {
  container: {
    light: [tw`bg-white text-black`],
    dark: [tw`bg-[#191B1F] text-white`],
    jupiter: [tw`bg-v3-bg text-white`],
  },
  text: {
    light: [tw`text-black`],
    dark: [tw`text-white`],
    jupiter: [tw`text-white`],
  },
};

export const CurrentUserBadge: React.FC<{ onClick?: () => void; className?: string }> = ({ onClick, className }) => {
  const { wallet, publicKey } = useWallet();
  const { theme } = useUnifiedWalletContext();

  if (!wallet || !publicKey) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      css={[styles.container[theme], tw`flex items-center py-2 px-3 rounded-2xl h-7 cursor-pointer`]}
      className={className}
    >
      <span
        tw="w-4 h-4 rounded-full flex justify-center items-center"
        style={{ position: 'relative' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Wallet logo" width={16} height={16} src={wallet?.adapter?.icon} />
      </span>

      <span css={[tw`ml-2 text-xs`, styles.text[theme]]}>{shortenAddress(`${publicKey}`)}</span>
    </button>
  );
};
