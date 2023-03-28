import '../styles/globals.css';
import { StoreProvider } from '../utils/Store';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loading from '../components/Loading';
import { SSRProvider } from 'react-aria';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        {Component.auth ? (
          <SSRProvider>
            <Auth adminOnly={Component.auth.adminOnly}>
              <Component {...pageProps} />
            </Auth>
          </SSRProvider>
        ) : (
          <SSRProvider>
            <Component {...pageProps} />
          </SSRProvider>
        )}
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  if (status === 'loading') {
    return <Loading />;
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=admin login required');
  }

  return children;
}

export default MyApp;
