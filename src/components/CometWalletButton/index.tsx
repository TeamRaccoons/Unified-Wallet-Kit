import React, { ReactNode } from "react";
import 'twin.macro';

import { CurrentUserBadge } from "../CurrentUserBadge";
import { useCometKit } from "../../contexts/CometKitProvider";
import ModalDialog from "../ModalDialog";
import CometWalletModal from '../../components/CometWalletModal';
import tw from "twin.macro";

const CometWalletButton: React.FC<{ overrideContent?: ReactNode; buttonClassName?: string; currentUserClassName?: string; }> = ({ overrideContent, buttonClassName: className, currentUserClassName }) => {
  const [shouldRender, setShouldRender] = React.useState(false);
  const { disconnect, connecting, connected } = useCometKit();

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

  return (
    <>
      <ModalDialog open={shouldRender} onClose={() => setShouldRender(false)}>
        <CometWalletModal onClose={() => setShouldRender(false)} />
      </ModalDialog>

      {!connected ? (
        <button
          type="button"
          css={[
            overrideContent ? undefined : tw`rounded-lg bg-white text-black text-xs py-3 px-5 font-semibold`
          ]}
          className={className}
          onClick={() => setShouldRender(true)}
        >
          {overrideContent || content}
        </button>
      ) : (
        <CurrentUserBadge onClick={disconnect} className={currentUserClassName} />
      )}
    </>
  );
};

export default CometWalletButton;
