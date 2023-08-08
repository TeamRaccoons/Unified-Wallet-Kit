import React, { ReactNode, useMemo } from "react";
import { Adapter, WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { useToggle } from 'react-use';
import { BackpackWalletName, PhantomWalletName, SolflareWalletName } from "@solana/wallet-adapter-wallets";

import { WalletListItem, WalletIcon } from './WalletListItem';

import Collapse from '../../components/Collapse';

import ChevronUpIcon from '../../icons/ChevronUpIcon';
import ChevronDownIcon from '../../icons/ChevronDownIcon';
import { usePreviouslyConnected } from '../../contexts/WalletConnectionProvider/previouslyConnectedProvider';
import { isMobile } from '../../misc/utils';
import { useCometContext, useCometKit } from "../../contexts/CometKitProvider";
import CloseIcon from "../../icons/CloseIcon";
import tw from "twin.macro";

const PRIORITISE: {
  [value in WalletReadyState]: number;
} = {
  [WalletReadyState.Installed]: 1,
  [WalletReadyState.Loadable]: 2,
  [WalletReadyState.NotDetected]: 3,
  [WalletReadyState.Unsupported]: 3,
};
export interface WalletModalProps {
  className?: string;
  logo?: ReactNode;
  container?: string;
}

type HIGHLIGHTED_BY = 'PreviouslyConnected' | 'Installed' | 'TopWallet';
const TOP_WALLETS: WalletName[] = [PhantomWalletName, SolflareWalletName, BackpackWalletName];

interface ICometWalletModal {
  onClose: () => void;
}

const sortByPrecedence = (walletPrecedence: WalletName[]) => (a: Adapter, b: Adapter) => {
  if (!walletPrecedence) return 0;

  const aIndex = walletPrecedence.indexOf(a.name);
  const bIndex = walletPrecedence.indexOf(b.name);

  if (aIndex === -1 && bIndex === -1) return 0;
  if (aIndex >= 0) {
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  }

  if (bIndex >= 0) {
    if (aIndex === -1) return 1;
    return bIndex - aIndex;
  }
  return 0;
};

const CometWalletModal: React.FC<ICometWalletModal> = ({ onClose }) => {
  const { wallets, select } = useCometKit();
  const { walletPrecedence, handleConnectClick } = useCometContext();
  const [isOpen, onToggle] = useToggle(false);
  const previouslyConnected = usePreviouslyConnected();

  const list: { highlightedBy: HIGHLIGHTED_BY; highlight: Adapter[]; others: Adapter[] } = useMemo(() => {
    // Then, Installed, Top 3, Loadable, NotDetected
    const filteredAdapters = wallets.reduce<{
      previouslyConnected: Adapter[];
      installed: Adapter[];
      top3: Adapter[];
      loadable: Adapter[];
      notDetected: Adapter[];
    }>(
      (acc, wallet) => {
        const adapterName = wallet.adapter.name;

        // Previously connected takes highest
        const previouslyConnectedIndex = previouslyConnected.indexOf(adapterName);
        if (previouslyConnectedIndex >= 0) {
          acc.previouslyConnected[previouslyConnectedIndex] = wallet.adapter;
          return acc;
        }
        // Then Installed
        if (wallet.readyState === WalletReadyState.Installed) {
          acc.installed.push(wallet.adapter);
          return acc;
        }
        // Top 3
        const topWalletsIndex = TOP_WALLETS.indexOf(adapterName);
        if (topWalletsIndex >= 0) {
          acc.top3[topWalletsIndex] = wallet.adapter;
          return acc;
        }
        // Loadable
        if (wallet.readyState === WalletReadyState.Loadable) {
          acc.loadable.push(wallet.adapter);
          return acc;
        }
        // NotDetected
        if (wallet.readyState === WalletReadyState.NotDetected) {
          acc.loadable.push(wallet.adapter);
          return acc;
        }
        return acc;
      },
      {
        previouslyConnected: [],
        installed: [],
        top3: [],
        loadable: [],
        notDetected: [],
      },
    );

    if (filteredAdapters.previouslyConnected.length > 0) {
      const { previouslyConnected, ...rest } = filteredAdapters;

      const highlight = filteredAdapters.previouslyConnected.slice(0, 3);
      const others = Object.values(rest)
        .flat()
        .sort((a, b) => PRIORITISE[a.readyState] - PRIORITISE[b.readyState])
        .sort(sortByPrecedence(walletPrecedence));
      others.unshift(...filteredAdapters.previouslyConnected.slice(3, filteredAdapters.previouslyConnected.length));

      return {
        highlightedBy: 'PreviouslyConnected',
        highlight,
        others,
      };
    }

    if (filteredAdapters.installed.length > 0) {
      const { installed, ...rest } = filteredAdapters;
      const highlight = filteredAdapters.installed.slice(0, 3);
      const others = Object.values(rest)
        .flat()
        .sort((a, b) => PRIORITISE[a.readyState] - PRIORITISE[b.readyState])
        .sort(sortByPrecedence(walletPrecedence));
      others.unshift(...filteredAdapters.installed.slice(3, filteredAdapters.installed.length));

      return { highlightedBy: 'Installed', highlight, others };
    }

    const { top3, ...rest } = filteredAdapters;
    const others = Object.values(rest)
      .flat()
      .sort((a, b) => PRIORITISE[a.readyState] - PRIORITISE[b.readyState])
      .sort(sortByPrecedence(walletPrecedence));
    return { highlightedBy: 'TopWallet', highlight: top3, others };
  }, [wallets, previouslyConnected]);

  const renderWalletList = useMemo(
    () => (
      <div tw="mt-4 grid gap-2 grid-cols-2 pb-4" translate="no">
        {list.others.map((adapter, index) => {
          return (
            <ul key={index}>
              <WalletListItem handleClick={(event) => handleConnectClick(event, adapter)} wallet={adapter} />
            </ul>
          );
        })}
      </div>
    ),
    [handleConnectClick, list.others],
  );

  return (
    <div tw="max-w-md w-full relative flex flex-col overflow-hidden text-white !bg-[#313E4C] border border-white/10 rounded-xl max-h-[90vh] lg:max-h-[576px] transition-height duration-500 ease-in-out ">
      <div tw="px-5 py-6 flex justify-between leading-none">
        <div>
          <div tw="font-semibold">
            <span>Connect Wallet</span>
          </div>
          <div tw="text-xs text-white/50 mt-1">
            <span>You need to connect a Solana wallet.</span>
          </div>
        </div>

        <button tw="absolute top-4 right-4" onClick={onClose}>
          <CloseIcon width={12} height={12} />
        </button>
      </div>

      <div tw="border-t-[1px] border-white/10" />

      <div
        className="hideScrollbar"
        css={[
          tw`h-full overflow-y-auto pt-3 pb-8 px-5 relative`,
          isOpen && tw`mb-7`,
        ]}
      >
        <span tw="mt-6 text-xs  font-semibold">
          {list.highlightedBy === 'PreviouslyConnected' ? `Recently used` : null}
          {list.highlightedBy === 'Installed' ? `Installed wallets` : null}
          {list.highlightedBy === 'TopWallet' ? `Popular wallets` : null}
        </span>

        <div tw="mt-4 flex flex-col lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0">
          {list.highlight.map((adapter, idx) => {
            return (
              <div
                key={idx}
                onClick={(event) => handleConnectClick(event, adapter)}
                css={[
                  tw`p-4 lg:p-5 border border-white/10 rounded-lg hover:bg-white/10 flex lg:flex-col items-center lg:justify-center cursor-pointer flex-1 lg:max-w-[33%]`,
                  tw`hover:backdrop-blur-xl hover:shadow-2xl transition-all`,
                ]}
              >
                {isMobile() ? (
                  <WalletIcon wallet={adapter} width={24} height={24} />
                ) : (
                  <WalletIcon wallet={adapter} width={30} height={30} />
                )}
                <span tw="font-semibold text-xs ml-4 lg:ml-0 lg:mt-3">{adapter.name}</span>
              </div>
            );
          })}
        </div>

        {list.others.length > 0 ? (
          <>
            <div tw="mt-5 flex justify-between cursor-pointer" onClick={onToggle}>
              <span tw="text-xs font-semibold">
                <span>More wallets</span>
              </span>

              <div tw=" flex items-center">
                <span tw="w-[10px] h-[6px]">{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
              </div>
            </div>

            <Collapse height={0} maxHeight={'auto'} expanded={isOpen}>
              {renderWalletList}
            </Collapse>
          </>
        ) : null}
      </div>

      {/* Bottom Shades */}
      {isOpen ? (
        <>
          <div
            tw="block w-full h-20 absolute left-0 bottom-7 z-50 "
            style={{
              background: 'linear-gradient(180deg, rgba(58, 59, 67, 0) 0%, #313E4C 100%)',
              pointerEvents: 'none',
            }}
          />
        </>
      ) : null}
    </div>
  );
};

export default CometWalletModal;
