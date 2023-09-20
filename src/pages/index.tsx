import React, { useState } from 'react';
import 'twin.macro';

import AppHeader from 'src/components/AppHeader/AppHeader';
import Footer from 'src/components/Footer/Footer';
import SexyChameleonText from 'src/components/SexyChameleonText/SexyChameleonText';
import ExampleAllWallets from 'src/components/examples/ExampleAllWallets';
import ExampleBaseOnly from 'src/components/examples/ExampleBaseOnly';
import ExampleSelectedWallets from 'src/components/examples/ExampleSelectedWallets';
import { IUnifiedTheme } from 'src/contexts/UnifiedWalletContext';
import Toggle from 'src/components/Toggle';
import { AllLanguage, DEFAULT_LANGUAGE, LANGUAGE_LABELS, OTHER_LANGUAGES } from 'src/contexts/TranslationProvider/i18n';
import tw from 'twin.macro';

const Index = () => {
  const [theme, setTheme] = useState<IUnifiedTheme>('dark');
  const [lang, setLang] = useState<AllLanguage>('en');

  return (
    <>
      <div tw="bg-jupiter-dark-bg h-screen w-screen max-w-[100vw] overflow-x-hidden flex flex-col justify-between">
        <div>
          <AppHeader />

          <div tw="">
            <div tw="flex flex-col items-center h-full w-full mt-4 md:mt-14">
              <div tw="flex flex-col justify-center items-center text-center">
                <SexyChameleonText>
                  <span tw="text-4xl md:text-[52px] font-semibold px-4 pb-2 md:px-0">Unified Wallet Kit</span>
                </SexyChameleonText>
                <p tw="text-[#9D9DA6] text-base mt-4 px-2">
                  Unified Wallet Kit is an open-sourced, the Swiss Army Knife wallet adapter.
                  <br />
                  Easiest integration for devs, Best experience for users.
                </p>
              </div>
            </div>

            <div tw="flex flex-col space-y-10 items-center justify-center p-4">
              <div tw="text-white font-semibold text-sm space-y-8">
                <div tw="flex flex-col">
                  <div tw="w-full border-b border-b-white/10 font-semibold text-center mb-2 pb-2">Theme</div>

                  <div tw="flex flex-wrap gap-3">
                    {(['light', 'dark'] as IUnifiedTheme[]).map((t) => (
                      <div
                        key={t}
                        onClick={() => setTheme(t)}
                        css={[
                          tw`cursor-pointer border border-white/10 rounded-lg py-0.5 px-2`,
                          theme === t ? tw`bg-white text-black` : 'hover:bg-white/10',
                        ]}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div tw="flex flex-col">
                  <div tw="w-full border-b border-b-white/10 font-semibold text-center mb-2 pb-2">Language</div>

                  <div tw="flex flex-wrap gap-3">
                    {[DEFAULT_LANGUAGE, ...OTHER_LANGUAGES].map((l) => (
                      <div
                        key={l}
                        onClick={() => setLang(l)}
                        css={[
                          tw`cursor-pointer border border-white/10 rounded-lg py-0.5 px-2`,
                          lang === l ? tw`bg-white text-black` : 'hover:bg-white/10',
                        ]}
                      >
                        {LANGUAGE_LABELS[l]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hideScrollbar" tw="bg-black/25 mt-12 max-w-[600px] rounded-xl p-4 w-full">
                <div tw="font-semibold text-white">Base with Wallet Standard only</div>
                <div tw="mt-4">
                  <ExampleBaseOnly theme={theme} lang={lang} />
                </div>
              </div>

              <div className="hideScrollbar" tw="bg-black/25 mt-12 max-w-[600px] rounded-xl p-4 w-full">
                <div tw="font-semibold text-white">With selected wallets</div>
                <div tw="mt-4">
                  <ExampleSelectedWallets theme={theme} lang={lang} />
                </div>
              </div>

              <div className="hideScrollbar" tw="bg-black/25 mt-12 max-w-[600px] rounded-xl p-4 w-full">
                <div tw="font-semibold text-white">Example with All Wallets, and Custom Wallets</div>
                <div tw="mt-4">
                  <ExampleAllWallets theme={theme} lang={lang} />
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
  );
};

export default Index;
