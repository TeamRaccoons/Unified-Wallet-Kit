import { Adapter } from '@solana/wallet-adapter-base';
import React, { DetailedHTMLProps, FC, ImgHTMLAttributes, MouseEventHandler, useCallback, useMemo } from 'react';
import 'twin.macro';

import UnknownIconSVG from '../../icons/UnknownIconSVG';
import { isMobile } from '../../misc/utils';
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile';
import tw from 'twin.macro';
import { IStandardStyle, useUnifiedWalletContext } from '../../contexts/UnifiedWalletContext';
import { useTranslation } from '../../contexts/TranslationProvider';

export interface WalletIconProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  wallet: Adapter | null;
  width?: number;
  height?: number;
}

const styles: IStandardStyle = {
  container: {
    light: [tw`bg-gray-50 hover:shadow-lg hover:border-black/10`],
    dark: [tw`hover:shadow-2xl hover:bg-white/10`],
    jupiter: [tw`hover:shadow-2xl hover:bg-white/10`],
  },
};

export const WalletIcon: FC<WalletIconProps> = ({ wallet, width = 24, height = 24 }) => {
  const [hasError, setHasError] = React.useState(false);

  const onError = useCallback(() => setHasError(true), []);

  if (wallet && wallet.icon && !hasError) {
    return (
      <span style={{ minWidth: width, minHeight: height }}>
        {/* // eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={width}
          height={height}
          src={wallet.icon}
          alt={`${wallet.name} icon`}
          tw="object-contain"
          onError={onError}
        />
      </span>
    );
  } else {
    return (
      <span style={{ minWidth: width, minHeight: height }}>
        <UnknownIconSVG width={width} height={height} />
      </span>
    );
  }
};

export interface WalletListItemProps {
  handleClick: MouseEventHandler<HTMLButtonElement>;
  wallet: Adapter;
}

export const WalletListItem = ({ handleClick, wallet }: WalletListItemProps) => {
  const { theme } = useUnifiedWalletContext();
  const { t } = useTranslation();

  const adapterName = useMemo(() => {
    if (!wallet) return '';
    if (wallet.name === SolanaMobileWalletAdapterWalletName) return t(`Mobile`);
    return wallet.name;
  }, [wallet?.name]);

  return (
    <li>
      <button
        type="button"
        onClick={handleClick}
        css={[
          tw`flex items-center w-full px-5 py-4 space-x-5 transition-all border rounded-lg cursor-pointer border-white/10 hover:bg-white/10 hover:backdrop-blur-xl hover:shadow-2xl`,
          styles.container[theme],
        ]}
      >
        {isMobile() ? (
          <WalletIcon wallet={wallet} width={24} height={24} />
        ) : (
          <WalletIcon wallet={wallet} width={30} height={30} />
        )}
        <span tw="font-semibold text-xs overflow-hidden text-ellipsis">{adapterName}</span>
      </button>
    </li>
  );
};
