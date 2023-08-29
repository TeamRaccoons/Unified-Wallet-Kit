import React, { ReactNode, useCallback } from 'react';
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile';
import tw from 'twin.macro';

import { CurrentUserBadge } from '../CurrentUserBadge';
import { useCometContext, useCometKit } from '../../contexts/CometKitProvider';
import { MWA_NOT_FOUND_ERROR } from '../../contexts/CometKitContext';

export const CometWalletButton: React.FC<{
  overrideContent?: ReactNode;
  buttonClassName?: string;
  currentUserClassName?: string;
}> = ({ overrideContent, buttonClassName: className, currentUserClassName }) => {
  const { setShowModal } = useCometContext();
  const { disconnect, connect, connecting, wallet } = useCometKit();

  const content = (
    <>
      {connecting && (
        <span tw="text-xs">
          <span>Connecting...</span>
        </span>
      )}
      {/* Mobile */}
      {!connecting && (
        <span tw="block md:hidden">
          <span>Connect</span>
        </span>
      )}
      {/* Desktop */}
      {!connecting && (
        <span tw="hidden md:block">
          <span>Connect Wallet</span>
        </span>
      )}
    </>
  );

  const handleClick = useCallback(async () => {
    try {
      if ('' === SolanaMobileWalletAdapterWalletName) {
        await connect();

        return;
      } else {
        setShowModal(true);
      }
    } catch (error) {
      if (error instanceof Error && error.message === MWA_NOT_FOUND_ERROR) {
        setShowModal(true);
      }
    }
  }, [wallet, connect]);

  return (
    <>
      {!wallet?.adapter.connected ? (
        <div
          css={[
            overrideContent
              ? undefined
              : tw`rounded-lg bg-white text-black text-xs py-3 px-5 font-semibold cursor-pointer`,
          ]}
          className={className}
          onClick={handleClick}
        >
          {overrideContent || content}
        </div>
      ) : (
        <CurrentUserBadge onClick={disconnect} className={currentUserClassName} />
      )}
    </>
  );
};
