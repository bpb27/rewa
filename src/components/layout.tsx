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
        <nav className="fixed left-0 right-0 top-0 z-[9999] flex w-full space-x-3 bg-slate-800 p-3 font-semibold text-blue-50 ">
          <Link href="/tables/movies">All Movies</Link>
          <Link href="/top/actors">Most Appearances</Link>
        </nav>
        <div className="mx-2 mt-12">{children}</div>
      </div>
    </>
  );
}
