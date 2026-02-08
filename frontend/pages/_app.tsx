import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import NextAuthReact from 'next-auth/react';
import '../styles/globals.css';

// Access SessionProvider with type assertion to handle potential runtime issues
const SessionProvider = (NextAuthReact as any).SessionProvider || ((props: any) => props.children);

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
      <SessionProvider session={session}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </SessionProvider>
  );
}