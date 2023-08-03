import { CometWalletButton } from "src/components"
import AppHeader from "src/components/AppHeader/AppHeader"
import Footer from "src/components/Footer/Footer"
import SexyChameleonText from "src/components/SexyChameleonText/SexyChameleonText"

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

            <div tw="flex justify-center">
              <div tw="max-w-6xl bg-black/25 mt-12 rounded-xl flex flex-col md:flex-row w-full md:p-4">
                <div tw="flex w-full items-center justify-center">

                  <CometWalletButton />
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