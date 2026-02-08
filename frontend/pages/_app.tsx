import NextAuthReact from 'next-auth/react';

const { SessionProvider } = NextAuthReact as {
  SessionProvider: any;
};
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
      <SessionProvider session={session}>
        <Component {...pageProps} />  
      </SessionProvider>
  );
}