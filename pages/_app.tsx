import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider as AuthProvider } from 'next-auth/client';
import { AppContext, AppProvider } from '../components/AppContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'antd/dist/antd.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  React.useEffect(() => {}, []);

  return (
    <>
      <Head>
        <title>Caddy Web UI</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AuthProvider session={pageProps.session}>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </AuthProvider>
    </>
  );
};

export default MyApp;
