import NextAuthReact from 'next-auth/react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

// Access SessionProvider with type assertion to bypass TypeScript errors
const SessionProvider = (NextAuthReact as any).SessionProvider;

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
  );
}