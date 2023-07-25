import React from 'react';
import { AppProps } from 'next/app';
import '../styles/global.css'; // Import your global CSS file here

if (typeof window !== 'undefined') {
    window.history.scrollRestoration = 'manual'
}

const CloudStation = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default CloudStation