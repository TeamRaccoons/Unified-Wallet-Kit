import React, { ReactNode, useCallback } from 'react';
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile';
import tw from 'twin.macro';

import { CurrentUserBadge } from '../CurrentUserBadge';
import { useUnifiedWalletContext, useUnifiedWallet } from '../../contexts/UnifiedWalletProvider';
import { IStandardStyle, MWA_NOT_FOUND_ERROR } from '../../contexts/UnifiedWalletContext';
import { useTranslation } from '../../contexts/TranslationProvider';

const styles: IStandardStyle = {
  container: {
    light: [tw`bg-white text-black`],
    dark: [tw`bg-[#31333B] text-white`],
    jupiter: [tw`bg-v3-bg text-white`],
  },
};

export const UnifiedWalletButton: React.FC<{
  overrideContent?: ReactNode;
  buttonClassName?: string;
  currentUserClassName?: string;
}> = ({ overrideContent, buttonClassName: className, currentUserClassName }) => {
  const { setShowModal, theme } = useUnifiedWalletContext();
  const { disconnect, connect, connecting, wallet } = useUnifiedWallet();
  const { t } = useTranslation();

  const content = (
    <>
      {connecting && (
        <span tw="text-xs">
          <span>{t(`Connecting...`)}</span>
        </span>
      )}
      {/* Mobile */}
      {!connecting && (
        <span tw="block md:hidden">
          <span>{t(`Connect`)}</span>
        </span>
      )}
      {/* Desktop */}
      {!connecting && (
        <span tw="hidden md:block">
          <span>{t(`Connect Wallet`)}</span>
        </span>
      )}
    </>
  );

  const handleClick = useCallback(async () => {
    try {
      if (wallet?.adapter?.name === SolanaMobileWalletAdapterWalletName) {
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
        <>
          {overrideContent ? (
            // To prevent react render error where <button> is nested
            <div css={styles.container[theme]} className={className} onClick={handleClick}>
              {overrideContent}
            </div>
          ) : (
            <button
              type="button"
              css={[
                tw`rounded-lg text-xs py-3 px-5 font-semibold cursor-pointer text-center w-auto`,
                styles.container[theme],
              ]}
              className={className}
              onClick={handleClick}
            >
              {content}
            </button>
          )}
        </>
      ) : (
        <CurrentUserBadge onClick={disconnect} className={currentUserClassName} />
      )}
    </>
  );
};
