import { BaseSignerWalletAdapter, WalletName, WalletNotConnectedError, WalletReadyState, isVersionedTransaction } from "@solana/wallet-adapter-base";
import { Keypair, Transaction, TransactionVersion, VersionedTransaction } from "@solana/web3.js";

export interface IHardcodedWalletStandardAdapter {
  id: string; name: WalletName; url: string; icon: string
}

export default class HardcodedWalletStandardAdapter extends BaseSignerWalletAdapter {
  name = '' as WalletName;
  url = '';
  icon = '';
  supportedTransactionVersions: ReadonlySet<TransactionVersion> = new Set(['legacy', 0]);

  /**
   * Storing a keypair locally like this is not safe because any application using this adapter could retrieve the
   * secret key, and because the keypair will be lost any time the wallet is disconnected or the window is refreshed.
   */
  private _keypair: Keypair | null = null;

  constructor({ name, url, icon }: { name: WalletName; url: string; icon: string }) {
    super();
    this.name = name;
    this.url = url;
    this.icon = icon;
  }

  get connecting() {
    return false;
  }

  get publicKey() {
    return this._keypair && this._keypair.publicKey;
  }

  get readyState() {
    return WalletReadyState.NotDetected;
  }

  async connect(): Promise<void> {
    throw new WalletNotConnectedError();
  }

  async disconnect(): Promise<void> {
    this._keypair = null;
    this.emit('disconnect');
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
    if (!this._keypair) throw new WalletNotConnectedError();

    if (isVersionedTransaction(transaction)) {
      transaction.sign([this._keypair]);
    } else {
      transaction.partialSign(this._keypair);
    }

    return transaction;
  }
}
