import React, { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { shortenAddress } from '../misc/utils';
import { WRAPPED_SOL_MINT } from '../misc/constants';
import { useAccounts } from '../contexts/accounts';

export const CurrentUserBadge: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { wallet, publicKey } = useWallet();
  const { accounts } = useAccounts();

  const solBalance = useMemo(() => {
    if (accounts[WRAPPED_SOL_MINT.toString()]) {
      return accounts[WRAPPED_SOL_MINT.toString()].balance;
    }
    return 0;
  }, [publicKey, accounts]);

  if (!wallet || !publicKey) {
    return null;
  }

  return (
    <div onClick={onClick} tw="flex items-center bg-[#191B1F] py-2 px-3 rounded-2xl h-7 cursor-pointer">
      <div
        tw="w-4 h-4 rounded-full bg-[#191B1F] dark:bg-white/10 flex justify-center items-center"
        style={{ position: 'relative' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Wallet logo" width={16} height={16} src={wallet?.adapter?.icon} />
      </div>

      <div tw="ml-2">
        <div tw="text-xs text-white">{shortenAddress(`${publicKey}`)}</div>
      </div>
    </div>
  );
};
