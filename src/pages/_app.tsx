import { type AppProps } from 'next/app';
import { Poppins as Font } from 'next/font/google';
import { useEffect } from 'react';
import { ascii } from '~/data/lookyloo';
import '~/globals.css';
import { trpc } from '~/trpc/client';

// don't need to specify the font weight for variable fonts https://fonts.google.com/variablefonts
const font = Font({ weight: ['100', '300', '400', '500', '700', '900'], subsets: ['latin'] });

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.log('https://github.com/bpb27/rewa', ascii);
    }
  }, []);
  return (
    <main className={font.className}>
      <Component {...pageProps} />
    </main>
  );
}

export default trpc.withTRPC(App);
