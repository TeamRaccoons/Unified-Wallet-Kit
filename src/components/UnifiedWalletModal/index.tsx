import { Adapter, WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useToggle } from 'react-use';
import tw from 'twin.macro';

import { WalletIcon, WalletListItem } from './WalletListItem';

import Collapse from '../../components/Collapse';

import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile';
import { useTranslation } from '../../contexts/TranslationProvider';
import { IStandardStyle, useUnifiedWallet, useUnifiedWalletContext } from '../../contexts/UnifiedWalletContext';
import { usePreviouslyConnected } from '../../contexts/WalletConnectionProvider/previouslyConnectedProvider';
import ChevronDownIcon from '../../icons/ChevronDownIcon';
import ChevronUpIcon from '../../icons/ChevronUpIcon';
import CloseIcon from '../../icons/CloseIcon';
import { isMobile, useOutsideClick } from '../../misc/utils';
import NotInstalled from './NotInstalled';
import { OnboardingFlow } from './Onboarding';

const styles: IStandardStyle = {
  container: {
    light: [tw`text-black !bg-white shadow-xl`],
    dark: [tw`text-white !bg-[#3A3B43] border border-white/10`],
    jupiter: [tw`text-white bg-[rgb(49, 62, 76)]`],
  },
  shades: {
    light: [tw`bg-gradient-to-t from-[#ffffff] to-transparent pointer-events-none`],
    dark: [tw`bg-gradient-to-t from-[#3A3B43] to-transparent pointer-events-none`],
    jupiter: [tw`bg-gradient-to-t from-[rgb(49, 62, 76)] to-transparent pointer-events-none`],
  },
  walletItem: {
    light: [tw`bg-gray-50 hover:shadow-lg hover:border-black/10`],
    dark: [tw`hover:shadow-2xl hover:bg-white/10`],
    jupiter: [tw`hover:shadow-2xl hover:bg-white/10`],
  },
  subtitle: {
    light: [tw`text-black/50`],
    dark: [tw`text-white/50`],
    jupiter: [tw`text-white/50`],
  },
  header: {
    light: [tw`border-b`],
    dark: [],
    jupiter: [],
  },
  text: {
    light: [tw`text-black`],
    dark: [tw`text-white`],
    jupiter: [tw`text-white`],
  },
};

const Header: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { theme } = useUnifiedWalletContext();
  const { t } = useTranslation();

  return (
    <div css={[tw`px-5 py-6 flex justify-between leading-none`, styles.header[theme]]}>
      <div>
        <div tw="font-semibold">
          <span>{t(`Connect Wallet`)}</span>
        </div>
        <div css={[tw`text-xs mt-1`, styles.subtitle[theme]]}>
          <span>{t(`You need to connect a Solana wallet.`)}</span>
        </div>
      </div>

      <button tw="absolute top-4 right-4" onClick={onClose}>
        <CloseIcon width={12} height={12} />
      </button>
    </div>
  );
};

const ListOfWallets: React.FC<{
  list: {
    highlightedBy: HIGHLIGHTED_BY;
    highlight: Adapter[];
    others: Adapter[];
  };
  onToggle: (nextValue?: any) => void;
  isOpen: boolean;
}> = ({ list, onToggle, isOpen }) => {
  const { handleConnectClick, walletlistExplanation, walletAttachments, theme } = useUnifiedWalletContext();
  const { t } = useTranslation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNotInstalled, setShowNotInstalled] = useState<Adapter | false>(false);

  const onClickWallet = React.useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>, adapter: Adapter) => {
    if (adapter.readyState === WalletReadyState.NotDetected) {
      setShowNotInstalled(adapter);
      return;
    }
    handleConnectClick(event, adapter);
  }, []);

  const renderWalletList = useMemo(
    () => (
      <div>
        <div tw="mt-4 grid gap-2 grid-cols-2 pb-4" translate="no">
          {list.others.map((adapter, index) => {
            return (
              <ul key={index}>
                <WalletListItem handleClick={(e) => onClickWallet(e, adapter)} wallet={adapter} />
              </ul>
            );
          })}
        </div>

        {list.highlightedBy !== 'Onboarding' && walletlistExplanation ? (
          <div css={[tw`text-xs font-semibold underline`, list.others.length > 6 ? tw`mb-8` : '']}>
            <a href={walletlistExplanation.href} target="_blank" rel="noopener noreferrer">
              <span>{t(`Can't find your wallet?`)}</span>
            </a>
          </div>
        ) : null}
      </div>
    ),
    [handleConnectClick, list.others],
  );

  const hasNoWallets = useMemo(() => {
    return list.highlight.length === 0 && list.others.length === 0;
  }, [list]);

  useEffect(() => {
    if (hasNoWallets) {
      setShowOnboarding(true);
    }
  }, [hasNoWallets]);

  if (showOnboarding) {
    return <OnboardingFlow showBack={!hasNoWallets} onClose={() => setShowOnboarding(false)} />;
  }

  if (showNotInstalled) {
    return (
      <NotInstalled
        adapter={showNotInstalled}
        onClose={() => setShowNotInstalled(false)}
        onGoOnboarding={() => {
          setShowOnboarding(true);
          setShowNotInstalled(false);
        }}
      />
    );
  }

  return (
    <>
      <div className="hideScrollbar" css={[tw`h-full overflow-y-auto pt-3 pb-8 px-5 relative`, isOpen && tw`mb-7`]}>
        <span tw="mt-6 text-xs font-semibold">
          {list.highlightedBy === 'PreviouslyConnected' ? t(`Recently used`) : null}
          {list.highlightedBy === 'TopAndRecommended' ? t(`Recommended wallets`) : null}
        </span>

        <div>
          <div tw="mt-4 grid gap-2 grid-cols-2 pb-4" translate="no">
            {list.highlight.map((adapter, index) => {
              return (
                <ul key={index}>
                  <WalletListItem handleClick={(e) => onClickWallet(e, adapter)} wallet={adapter} />
                </ul>
              );
            })}
          </div>
        </div>

        {list.others.length > 0 ? (
          <>
            <button type="button" tw="mt-5 flex w-full items-center justify-between cursor-pointer" onClick={onToggle}>
              <span tw="text-xs font-semibold">
                <span css={[styles.text[theme]]}>{t(`More wallets`)}</span>
              </span>
            </button>

            {renderWalletList}
          </>
        ) : null}
      </div>

      {/* Bottom Shades */}
      {isOpen && list.others.length > 6 ? (
        <>
          <div css={[tw`block w-full h-20 absolute left-0 bottom-7 z-50`, styles.shades[theme]]} />
        </>
      ) : null}
    </>
  );
};

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

type HIGHLIGHTED_BY =
  | 'PreviouslyConnected' // last connected
  | 'TopAndRecommended' // Installed, and top wallets
  | 'Onboarding'
  | 'TopWallet';
const TOP_WALLETS: WalletName[] = [
  'Jupiter Mobile' as WalletName<'Jupiter Mobile'>,
  'Phantom' as WalletName<'Phantom'>,
  'Solflare' as WalletName<'Solflare'>,
  'Backpack' as WalletName<'Backpack'>,
];

interface IUnifiedWalletModal {
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

const UnifiedWalletModal: React.FC<IUnifiedWalletModal> = ({ onClose }) => {
  const { wallets } = useUnifiedWallet();
  const { walletPrecedence, theme, walletModalAttachments } = useUnifiedWalletContext();
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
      let others = Object.values(rest)
        .flat()
        .sort((a, b) => PRIORITISE[a.readyState] - PRIORITISE[b.readyState])
        .sort(sortByPrecedence(walletPrecedence || []));
      others.unshift(...filteredAdapters.previouslyConnected.slice(3, filteredAdapters.previouslyConnected.length));
      others = others.filter(Boolean);

      return {
        highlightedBy: 'PreviouslyConnected',
        highlight,
        others,
      };
    }

    if (filteredAdapters.installed.length > 0) {
      const { installed, top3, ...rest } = filteredAdapters;
      const highlight = [...installed.slice(0, 3), ...top3.filter(Boolean)].filter(Boolean);

      const others = Object.values(rest)
        .flat()
        .sort((a, b) => PRIORITISE[a.readyState] - PRIORITISE[b.readyState])
        .sort(sortByPrecedence(walletPrecedence || []));
      others.unshift(...filteredAdapters.installed.slice(3, filteredAdapters.installed.length));

      return { highlightedBy: 'TopAndRecommended', highlight, others };
    }

    if (filteredAdapters.loadable.length === 0) {
      return { highlightedBy: 'Onboarding', highlight: [], others: [] };
    }

    const { top3, ...rest } = filteredAdapters;
    const others = Object.values(rest)
      .flat()
      .sort((a, b) => PRIORITISE[a.readyState] - PRIORITISE[b.readyState])
      .sort(sortByPrecedence(walletPrecedence || []));
    return { highlightedBy: 'TopWallet', highlight: top3, others };
  }, [wallets, previouslyConnected]);

  const contentRef = useRef<HTMLDivElement>(null);
  useOutsideClick(contentRef, onClose);

  return (
    <div
      ref={contentRef}
      css={[
        tw`max-w-md w-full relative flex flex-col overflow-hidden rounded-xl max-h-[90vh] lg:max-h-[576px] transition-height duration-500 ease-in-out `,
        styles.container[theme],
      ]}
    >
      <Header onClose={onClose} />
      <div tw="border-t-[1px] border-white/10" />
      <ListOfWallets list={list} onToggle={onToggle} isOpen={isOpen} />

      {walletModalAttachments?.footer ? <>{walletModalAttachments?.footer}</> : null}
    </div>
  );
};

export default UnifiedWalletModal;
