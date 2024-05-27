import React from 'react';
import type { AppProps } from 'next/app';
import { Toaster } from 'sonner';

import GlobalStyles from '../styles/GlobalStyles';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles />
      <Component className="App" {...pageProps} />
      <Toaster
        position="bottom-left"
        toastOptions={{ style: { border: 0, borderRadius: '1rem', overflow: 'hidden' } }}
      />
    </>
  );
}
