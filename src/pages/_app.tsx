import React from 'react';
import type { AppProps } from 'next/app';

import GlobalStyles from 'src/styles/GlobalStyles';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles />
      <Component className="App" {...pageProps} />
    </>
  )
}
