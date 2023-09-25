import { type AppProps } from 'next/app';
import { Open_Sans } from 'next/font/google';
import '~/globals.css';

// don't need to specify the font weight for variable fonts https://fonts.google.com/variablefonts
const font = Open_Sans({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
    </main>
  );
}
