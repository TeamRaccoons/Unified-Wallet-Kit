import AppHeader from 'src/components/AppHeader/AppHeader'
import Footer from 'src/components/Footer/Footer'
import SexyChameleonText from 'src/components/SexyChameleonText/SexyChameleonText'
import ExampleAllWallets from 'src/components/examples/ExampleAllWallets'
import ExampleBaseOnly from 'src/components/examples/ExampleBaseOnly'
import ExampleSelectedWallets from 'src/components/examples/ExampleSelectedWallets'

const Index = () => {
  return (
    <>
      <div tw="bg-jupiter-dark-bg h-screen w-screen max-w-[100vw] overflow-x-hidden flex flex-col justify-between">
        <div>
          <AppHeader />

          <div tw="">
            <div tw="flex flex-col items-center h-full w-full mt-4 md:mt-14">
              <div tw="flex flex-col justify-center items-center text-center">
                <SexyChameleonText>
                  <span tw="text-4xl md:text-[52px] font-semibold px-4 pb-2 md:px-0">
                    Jupiter Open Wallet
                  </span>
                </SexyChameleonText>
                <p tw="text-[#9D9DA6] w-[80%] md:max-w-[60%] text-base mt-4">
                  An open-sourced wallet adapter built by Jupiter.
                </p>
              </div>
            </div>

            <div tw="flex flex-col space-y-10 items-center justify-center p-4">
              <div tw="max-w-xl bg-black/25 mt-12 rounded-xl flex flex-col w-full p-4">
                <div tw="font-semibold text-white">
                  Base with Wallet Standard only
                </div>
                <div tw="flex w-full mt-4">
                  <ExampleBaseOnly />
                </div>
              </div>
              
              <div tw="max-w-xl bg-black/25 mt-12 rounded-xl flex flex-col w-full p-4">
                <div tw="font-semibold text-white">
                  With selected wallets
                </div>
                <div tw="flex w-full mt-4">
                  <ExampleSelectedWallets />
                </div>
              </div>

              <div tw="max-w-xl bg-black/25 mt-12 rounded-xl flex flex-col w-full p-4">
                <div tw="font-semibold text-white">
                  Example with All Wallets, and Custom Wallets
                </div>
                <div tw="flex w-full mt-4">
                  <ExampleAllWallets />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div tw="w-full bg-jupiter-bg mt-12">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Index