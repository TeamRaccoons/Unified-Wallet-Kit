import { Adapter } from '@solana/wallet-adapter-base';
import React, { DetailedHTMLProps, FC, ImgHTMLAttributes, MouseEventHandler, useCallback, useMemo } from 'react';

import classNames from 'classnames';
import UnknownIconSVG from '../../icons/UnknownIconSVG';
import { isMobile } from '../../misc/utils';

export interface WalletIconProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  wallet: Adapter | null;
  width?: number;
  height?: number;
}

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
  return (
    <li
      onClick={handleClick}
      tw={'flex items-center px-5 py-4 space-x-5 cursor-pointer border border-white/10 rounded-lg hover:bg-white/10 hover:backdrop-blur-xl hover:shadow-2xl transition-all'}
    >
      {isMobile() ? (
        <WalletIcon wallet={wallet} width={24} height={24} />
      ) : (
        <WalletIcon wallet={wallet} width={30} height={30} />
      )}
      <span tw="font-semibold text-xs overflow-hidden text-ellipsis">{wallet.name}</span>
    </li>
  );
};
