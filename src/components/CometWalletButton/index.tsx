import React, { MouseEvent, ReactNode, useCallback } from "react";
import { SolanaMobileWalletAdapterWalletName } from "@solana-mobile/wallet-adapter-mobile";
import tw from "twin.macro";

import { CurrentUserBadge } from "../CurrentUserBadge";
import { MWA_NOT_FOUND_ERROR, useCometKit } from "../../contexts/CometKitProvider";
import ModalDialog from "../ModalDialog";
import CometWalletModal from '../../components/CometWalletModal';

const CometWalletButton: React.FC<{ overrideContent?: ReactNode; buttonClassName?: string; currentUserClassName?: string; }> = ({ overrideContent, buttonClassName: className, currentUserClassName }) => {
  const [shouldRender, setShouldRender] = React.useState(false);
  const { disconnect, connect, connecting, connected, wallet } = useCometKit();

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

  const handleClick = useCallback(
    async () => {
      try {
        if (wallet?.adapter.name === SolanaMobileWalletAdapterWalletName) {
          await connect();

          return;
        } else {
          setShouldRender(true)
        }
      } catch (error) {
        if (error instanceof Error && error.message === MWA_NOT_FOUND_ERROR) {
          setShouldRender(true)
        }
      }
    },
    [wallet, connect],
  );
  
  return (
    <>
      <ModalDialog open={shouldRender} onClose={() => setShouldRender(false)}>
        <CometWalletModal onClose={() => setShouldRender(false)} />
      </ModalDialog>

      {!connected ? (
        <div
          css={[
            overrideContent ? undefined : tw`rounded-lg bg-white text-black text-xs py-3 px-5 font-semibold`
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

export default CometWalletButton;
