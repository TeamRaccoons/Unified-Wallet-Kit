import React, { ReactNode, useCallback } from 'react';
import tw, { TwStyle } from 'twin.macro';

import { CurrentUserBadge } from '../CurrentUserBadge';
import { useUnifiedWalletContext, useUnifiedWallet } from '../../contexts/UnifiedWalletProvider';
import { IUnifiedTheme } from '../../contexts/UnifiedWalletContext';
import { useTranslation } from '../../contexts/TranslationProvider';

const styles: Record<string, { [key in IUnifiedTheme]: TwStyle[] }> = {
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
    setShowModal(true);
  }, [wallet, connect]);

  return (
    <>
      {!wallet?.adapter.connected ? (
        <div
          css={[
            overrideContent
              ? undefined
              : tw`rounded-lg text-xs py-3 px-5 font-semibold cursor-pointer text-center w-auto`,
            styles.container[theme],
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
