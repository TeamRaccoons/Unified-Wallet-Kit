import { IWalletProps } from "../contexts/CometKitProvider";

const PreviewFunctionality = ({ title, walletProps }: { title: string, walletProps?: IWalletProps }) => {
  return (
    <div className="flex flex-col justify-center mt-4 border border-white/10 p-4 bg-white/10 rounded-lg text-white text-xs">
      <p className="font-semibold text-lg mb-4">{title}</p>

      <div className="flex flex-col space-y-4 w-full">
        <div className="">
          <div>
            Wallet:
          </div>
          <div>
            {walletProps?.wallet?.adapter.name}
          </div>
        </div>

        <div className="">
          <div>
            PublicKey:
          </div>
          <div>
            {walletProps?.publicKey?.toString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewFunctionality;
