import { Adapter } from '@solana/wallet-adapter-base';
import React, { DetailedHTMLProps, FC, ImgHTMLAttributes, MouseEventHandler, useCallback, useMemo } from 'react';
import 'twin.macro';

import UnknownIconSVG from '../../icons/UnknownIconSVG';
import { isMobile } from '../../misc/utils';
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile';
import tw, { TwStyle } from 'twin.macro';
import { IUnifiedTheme, useUnifiedWalletContext } from 'src/contexts/UnifiedWalletContext';

export interface WalletIconProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  wallet: Adapter | null;
  width?: number;
  height?: number;
}

const styles: Record<string, { [key in IUnifiedTheme]: TwStyle[] }> = {
  container: {
    light: [tw`bg-gray-50 hover:shadow-lg hover:border-black/10`],
    dark: [tw`hover:shadow-2xl hover:bg-white/10`],
  },
};

export const WalletIcon: FC<WalletIconProps> = ({ wallet, width = 24, height = 24 }) => {
  const [hasError, setHasError] = React.useState(false);

  const onError = useCallback(() => setHasError(true), []);

  if (wallet && wallet.icon && !hasError) {
    return (
      <div style={{ minWidth: width, minHeight: height }}>
        {/* // eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={width}
          height={height}
          src={wallet.icon}
          alt={`${wallet.name} icon`}
          tw="object-contain"
          onError={onError}
        />
      </div>
    );
  } else {
    return (
      <div style={{ minWidth: width, minHeight: height }}>
        <UnknownIconSVG width={width} height={height} />
      </div>
    );
  }
};

export interface WalletListItemProps {
  handleClick: MouseEventHandler<HTMLLIElement>;
  wallet: Adapter;
}

export const WalletListItem = ({ handleClick, wallet }: WalletListItemProps) => {
  const { theme } = useUnifiedWalletContext();

  const adapterName = useMemo(() => {
    if (wallet.name === SolanaMobileWalletAdapterWalletName) return 'Mobile';
    return wallet.name;
  }, [wallet.name]);

  return (
    <li
      onClick={handleClick}
      css={[
        tw`flex items-center px-5 py-4 space-x-5 cursor-pointer border border-white/10 rounded-lg hover:bg-white/10 hover:backdrop-blur-xl hover:shadow-2xl transition-all`,
        styles.container[theme],
      ]}
    >
      {isMobile() ? (
        <WalletIcon wallet={wallet} width={24} height={24} />
      ) : (
        <WalletIcon wallet={wallet} width={30} height={30} />
      )}
      <span tw="font-semibold text-xs overflow-hidden text-ellipsis">{adapterName}</span>
    </li>
  );
};
