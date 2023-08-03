import React from "react";
import 'twin.macro';

import { CurrentUserBadge } from "../CurrentUserBadge";
import { useCometKit } from "../../contexts/CometKitProvider";
import ModalDialog from "../ModalDialog";
import CometWalletModal from '../../components/CometWalletModal';

const CometWalletButton: React.FC<{ buttonClassName?: string; currentUserClassName?: string; }> = ({ buttonClassName: className, currentUserClassName }) => {
  const [shouldRender, setShouldRender] = React.useState(false);
  const { disconnect, connected } = useCometKit();

  return (
    <>
      <ModalDialog open={shouldRender} onClose={() => setShouldRender(false)}>
        <CometWalletModal onClose={() => setShouldRender(false)} />
      </ModalDialog>

      {!connected ? (
        <button
          type="button"
          tw="rounded-lg bg-white text-black text-xs py-3 px-5 font-semibold"
          className={className}
          onClick={() => setShouldRender(true)}
        >
          {`Connect Wallet`}
        </button>
      ) : (
        <CurrentUserBadge onClick={disconnect} className={currentUserClassName} />
      )}
    </>
  );
};

export default CometWalletButton;
