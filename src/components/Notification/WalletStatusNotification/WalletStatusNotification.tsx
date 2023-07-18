import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import AlertSuccess from './AlertSuccess';
import AlertInfo from './AlertInfo';
import AlertError from './AlertError';
import { ToastContentProps } from 'react-toastify';
import CloseIcon from '../../../icons/CloseIcon';
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile';
import { shortenAddress } from '../../../misc/utils';
import { useCometKit } from '../../../contexts/CometKitProvider';
import { Wallet } from '@solana/wallet-adapter-react';
import { usePrevious } from 'react-use';
import tw from 'twin.macro';

export enum IVariant {
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  ERROR = 'ERROR',
}

export const WalletNotification = ({
  id,
  variant,
  title,
  description,
  IconComponent,
}: {
  id: string | number;
  variant?: IVariant;
  title: React.ReactNode;
  description?: React.ReactNode;
  IconComponent?: React.ReactNode;
}) => {
  let bg;
  switch (variant) {
    case IVariant.SUCCESS:
      IconComponent = <AlertSuccess width={38} height={38} />;
      break;
    case IVariant.INFO:
      IconComponent = <AlertInfo width={38} height={38} />;
      break;
    case IVariant.ERROR:
      IconComponent = <AlertError width={38} height={38} />;
      break;
  }

  const dismiss = useCallback(() => {
    toast.dismiss(id)
  }, [id]);

  return (
    <div tw="relative bg-black text-white shadow-lg rounded-lg flex items-center w-full md:w-auto">
      {IconComponent && (
        <div css={[
          tw`rounded-full flex items-center justify-center h-8 w-8 mr-4`,
        ]}>{IconComponent}</div>
      )}

      {/* Prevent template string from overflowing */}
      <div style={{ maxWidth: '90%' }}>
        <div tw="text-lg font-bold">{title}</div>
        <div tw="text-xs text-black/50 dark:text-white/50">{description}</div>
      </div>

      <button tw="absolute top-0 right-0" onClick={dismiss}>
        <CloseIcon width={12} height={12} />
      </button>
    </div>
  );
};

const WALLET_STATUS_NOTIFICATION_ID = 'wallet-status-notification-id';
const WalletStatusNotification = () => {
  const { publicKey, wallet, connected } = useCometKit();
  // TODO: Integrate and expose legacy adapter
  const [asLegacyTransaction, setAsLegacyTransaction] = useState(false);
  const previouslyConnected = usePrevious<boolean>(connected);
  const previousWallet = usePrevious<Wallet | null>(wallet);

  useEffect(() => {
    // Disconnected
    if (previouslyConnected && previousWallet && (!wallet || !connected)) {
      toast(`Disconnected ${previousWallet.adapter.name || ''}`, { id: WALLET_STATUS_NOTIFICATION_ID })

    } else if (wallet && !publicKey && wallet.adapter.name !== SolanaMobileWalletAdapterWalletName) {
      // Connecting
      toast(`Connecting to ${wallet.adapter.name}`, { id: WALLET_STATUS_NOTIFICATION_ID })
    } else if (publicKey && wallet) {
      // Connected
      const addr = publicKey.toString();
      const truncatedAddress = shortenAddress(addr);
      const supportVersionedTransaction = Boolean(wallet.adapter.supportedTransactionVersions?.has(0));

      if (supportVersionedTransaction) {
        setAsLegacyTransaction(false);
      } else {
        setAsLegacyTransaction(true);
      }

      toast(
        <>
          <div>{`Connected to ${wallet.adapter.name} (${truncatedAddress})`}</div>
          {!supportVersionedTransaction && (
            <div tw="text-black/75 dark:text-white/75">{`Versioned Tx is turned off as your wallet does not support it.`}</div>
          )}
        </>, { id: WALLET_STATUS_NOTIFICATION_ID }
      )
    }
  }, [wallet, setAsLegacyTransaction, previousWallet, publicKey, connected, previouslyConnected]);


  return <></>;
};

export default WalletStatusNotification;
