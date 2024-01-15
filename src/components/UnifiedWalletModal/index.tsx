import { Adapter, WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useToggle } from 'react-use';

import { WalletIcon, WalletListItem } from './WalletListItem';

import Collapse from '../../components/Collapse';

import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile';
import tw, { TwStyle } from 'twin.macro';
import { useTranslation } from '../../contexts/TranslationProvider';
import { IUnifiedTheme, useUnifiedWallet, useUnifiedWalletContext } from '../../contexts/UnifiedWalletContext';
import { usePreviouslyConnected } from '../../contexts/WalletConnectionProvider/previouslyConnectedProvider';
import ChevronDownIcon from '../../icons/ChevronDownIcon';
import ChevronUpIcon from '../../icons/ChevronUpIcon';
import CloseIcon from '../../icons/CloseIcon';
import { isMobile, useOutsideClick } from '../../misc/utils';
import NotInstalled from './NotInstalled';
import { OnboardingFlow } from './Onboarding';

// TENSOR TRADE FIX: implemented missing deeplinks when clicking non-mobile wallet-adapters when using mobile chrome
export const mobileUniLink = (adapter: Adapter) => {
  const isIOSOrAndroidDevice = /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent);

  if (!isIOSOrAndroidDevice) return null;

  const uniLink =
    adapter.name === 'Backpack'
      ? 'https://backpack.app/ul/v1/browse/'
      : adapter.name === 'Solflare'
      ? 'https://solflare.com/ul/v1/browse/'
      : adapter.name === 'Phantom'
      ? 'https://phantom.app/ul/browse/'
      : adapter.name === 'OKX'
      ? `https://www.okx.com/download?deeplink=${encodeURIComponent('okx://wallet/dapp/url?dappUrl=')}`
      : undefined;
  if (!uniLink) return null;

  const defaultLink = encodeURIComponent('https://www.tensor.trade');

  let suffix =
    typeof window === 'undefined' || !window?.location?.href
      ? `${encodeURIComponent(defaultLink)}`
      : `${encodeURIComponent(window.location.href)}`;

  if (adapter.name === 'Solflare') {
    suffix = `${suffix}?ref=${window?.location?.origin || defaultLink}`;
  }

  return window.open(`${uniLink}${suffix}`, '_blank');
};

const styles: Record<string, { [key in IUnifiedTheme]: TwStyle[] }> = {
  container: {
    light: [tw`text-black !bg-white shadow-xl`],
    dark: [tw`text-white !bg-[#111314]`],
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
};

const HighlightedWallet = ({
  theme,
  popularWallet,
  highlightedBy,
  adapter,
  attachment,
  onClickWallet,
}: {
  theme: IUnifiedTheme;
  popularWallet?: boolean;
  highlightedBy: HIGHLIGHTED_BY;
  adapter: Adapter;
  attachment: React.ReactNode;
  onClickWallet: (event: React.MouseEvent<HTMLElement, MouseEvent>, adapter: Adapter) => void;
}) => {
  const { t } = useTranslation();
  const adapterName = (() => {
    if (adapter.name === SolanaMobileWalletAdapterWalletName) return t(`Mobile`);
    return adapter.name;
  })();

  return (
    <div
      onClick={(event) => onClickWallet(event, adapter)}
      css={[
        tw`py-4 px-4 lg:px-2 border border-white/10 rounded-lg flex lg:flex-col items-center lg:justify-center cursor-pointer flex-1`,
        popularWallet || highlightedBy === 'PreviouslyConnected' ? tw`lg:max-w-[100%]` : tw`lg:max-w-[33%]`,
        tw`hover:backdrop-blur-xl transition-all`,
        styles.walletItem[theme],
      ]}
    >
      {isMobile() ? (
        <WalletIcon wallet={adapter} width={24} height={24} />
      ) : (
        <WalletIcon wallet={adapter} width={30} height={30} />
      )}
      <span tw="font-semibold text-xs ml-4 lg:ml-0 lg:mt-3">{adapterName}</span>
      {attachment ? <div>{attachment}</div> : null}
    </div>
  );
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
    popularWallets: Adapter[];
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
    if (
      ![WalletReadyState.Installed, WalletReadyState.Loadable].includes(adapter.readyState) ||
      ([WalletReadyState.Loadable].includes(adapter.readyState) && adapter.name === 'Solflare')
    ) {
      if (mobileUniLink(adapter)) {
        return;
      }
    }
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
        <span tw="mt-6 text-xs font-semibold">{t(`Recommended Wallets`)}</span>
        <div tw="mt-4 flex flex-col lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0">
          {list.popularWallets.map((adapter, idx) => {
            const attachment = walletAttachments ? walletAttachments[adapter.name]?.attachment : null;

            return (
              <HighlightedWallet
                key={idx}
                theme={theme}
                popularWallet
                highlightedBy={list.highlightedBy}
                adapter={adapter}
                attachment={attachment}
                onClickWallet={onClickWallet}
              />
            );
          })}
        </div>
        {list.highlight.length > 0 && (
          <>
            <span tw="mt-6 text-xs font-semibold">
              {list.highlightedBy === 'PreviouslyConnected' ? t(`Recently used`) : null}
              {list.highlightedBy === 'Installed' ? t(`Installed wallets`) : null}
              {list.highlightedBy === 'TopWallet' ? t(`Recommended Wallets`) : null}
            </span>
            <div tw="mt-4 flex flex-col lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0">
              {list.highlight.map((adapter, idx) => {
                const attachment = walletAttachments ? walletAttachments[adapter.name]?.attachment : null;

                return (
                  <HighlightedWallet
                    key={idx}
                    theme={theme}
                    highlightedBy={list.highlightedBy}
                    adapter={adapter}
                    attachment={attachment}
                    onClickWallet={onClickWallet}
                  />
                );
              })}
            </div>
          </>
        )}

        {walletlistExplanation && list.others.length === 0 ? (
          <div tw="text-xs font-semibold mt-4 -mb-2 text-white/80 underline cursor-pointer">
            <a href={walletlistExplanation.href} target="_blank" rel="noopener noreferrer">
              <span>{t(`Can't find your wallet?`)}</span>
            </a>
          </div>
        ) : null}

        {list.others.length > 0 ? (
          <>
            <div tw="mt-5 flex justify-between cursor-pointer" onClick={onToggle}>
              <span tw="text-xs font-semibold">
                <span>{t(`More wallets`)}</span>
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
        <div tw="text-xs font-semibold mt-4 -mb-2 text-white/80 underline cursor-pointer">
          <button type="button" onClick={() => setShowOnboarding(true)}>
            <span>{t(`I don't have a wallet`)}</span>
          </button>
        </div>
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

type HIGHLIGHTED_BY = 'PreviouslyConnected' | 'Installed' | 'TopWallet' | 'Onboarding';
const TOP_WALLETS: WalletName[] = ['Backpack' as WalletName<'Backpack'>];

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
  const { walletPrecedence, theme } = useUnifiedWalletContext();
  const [isOpen, onToggle] = useToggle(false);
  const previouslyConnected = usePreviouslyConnected();

  const list: { popularWallets: Adapter[]; highlightedBy: HIGHLIGHTED_BY; highlight: Adapter[]; others: Adapter[] } =
    useMemo(() => {
      // Then, Installed, Top 3, Loadable, NotDetected
      const filteredAdapters = wallets.reduce<{
        popularWallets: Adapter[];
        previouslyConnected: Adapter[];
        installed: Adapter[];
        top3: Adapter[];
        loadable: Adapter[];
        notDetected: Adapter[];
      }>(
        (acc, wallet) => {
          const adapterName = wallet.adapter.name;

          // popular takes highest
          if (TOP_WALLETS.some((wallet) => wallet === adapterName)) {
            acc.popularWallets.push(wallet.adapter);
            return acc;
          }

          // Then previously connected
          const previouslyConnectedIndex = previouslyConnected.indexOf(adapterName);
          if (previouslyConnectedIndex >= 0) {
            if (TOP_WALLETS.indexOf(adapterName) >= 0) {
              acc.installed.unshift(wallet.adapter);
            } else {
              acc.previouslyConnected[previouslyConnectedIndex] = wallet.adapter;
            }
            return acc;
          }
          // Then Installed
          if (wallet.readyState === WalletReadyState.Installed) {
            if (TOP_WALLETS.indexOf(adapterName) >= 0) {
              acc.installed.unshift(wallet.adapter);
            } else {
              acc.installed.push(wallet.adapter);
            }
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
            if (TOP_WALLETS.indexOf(adapterName) >= 0) {
              acc.installed.unshift(wallet.adapter);
            } else {
              acc.loadable.push(wallet.adapter);
            }
            return acc;
          }
          // NotDetected
          if (wallet.readyState === WalletReadyState.NotDetected) {
            if (TOP_WALLETS.indexOf(adapterName) >= 0) {
              acc.installed.unshift(wallet.adapter);
            } else {
              acc.loadable.push(wallet.adapter);
            }
            return acc;
          }
          return acc;
        },
        {
          popularWallets: [],
          previouslyConnected: [],
          installed: [],
          top3: [],
          loadable: [],
          notDetected: [],
        },
      );

      if (filteredAdapters.previouslyConnected.length > 0) {
        const { popularWallets, previouslyConnected, ...rest } = filteredAdapters;

        const highlight = filteredAdapters.previouslyConnected.slice(0, 3);
        let others = Object.values(rest)
          .flat()
          .sort((a, b) => PRIORITISE[a.readyState] - PRIORITISE[b.readyState])
          .sort(sortByPrecedence(walletPrecedence || []));
        others.unshift(...filteredAdapters.previouslyConnected.slice(3, filteredAdapters.previouslyConnected.length));
        others = others.filter(Boolean);

        return {
          popularWallets: filteredAdapters.popularWallets,
          highlightedBy: 'PreviouslyConnected',
          highlight,
          others,
        };
      }

      if (filteredAdapters.installed.length > 0) {
        const { popularWallets, installed, ...rest } = filteredAdapters;
        const highlight = filteredAdapters.installed.slice(0, 3);
        const others = Object.values(rest)
          .flat()
          .sort((a, b) => PRIORITISE[a.readyState] - PRIORITISE[b.readyState])
          .sort(sortByPrecedence(walletPrecedence || []));
        others.unshift(...filteredAdapters.installed.slice(3, filteredAdapters.installed.length));

        return { popularWallets, highlightedBy: 'Installed', highlight, others };
      }

      if (filteredAdapters.loadable.length === 0) {
        const { popularWallets, installed, ...rest } = filteredAdapters;
        return { popularWallets, highlightedBy: 'Onboarding', highlight: [], others: [] };
      }

      const { popularWallets, top3, ...rest } = filteredAdapters;
      const others = Object.values(rest)
        .flat()
        .sort((a, b) => PRIORITISE[a.readyState] - PRIORITISE[b.readyState])
        .sort(sortByPrecedence(walletPrecedence || []));
      return { popularWallets, highlightedBy: 'TopWallet', highlight: top3, others };
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
    </div>
  );
};

export default UnifiedWalletModal;
