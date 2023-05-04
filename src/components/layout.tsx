import Head from 'next/head';
import { PropsWithChildren } from 'react';
import Link from 'next/link';

export default function Layout({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Movies on The Rewatchables podcast" />
        {/* <meta property="og:image" content="https://someimage.com"/> */}
        <meta name="og:title" content="Rewa" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <nav className="p-3 fixed top-0 bg-slate-800 w-full font-semibold text-blue-50 flex space-x-3">
          <Link href="/tables/movies">All Movies</Link>
          <Link href="/top/actors">Actors</Link>
          <Link href="/top/directors">Directors</Link>
          <Link href="/top/producers">Producers</Link>
          <Link href="/top/writers">Writers</Link>
          <Link href="/top/cinematographers">Cinematographers</Link>
        </nav>
        <div className="mt-12">{children}</div>
      </div>
      ;
    </>
  );
}
