import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import NextAuthReact from 'next-auth/react';
import '../styles/globals.css';

// Access SessionProvider from the imported module
const SessionProvider = (NextAuthReact as any).SessionProvider;

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
  );
}