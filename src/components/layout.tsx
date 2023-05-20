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
        <nav className="fixed z-[9999] top-0 left-0 right-0 w-full p-3 flex space-x-3 bg-slate-800 font-semibold text-blue-50 ">
          <Link href="/tables/movies">All Movies</Link>
          <Link href="/top/actors">Most Appearances</Link>
        </nav>
        <div className="mt-12 mx-2">{children}</div>
      </div>
    </>
  );
}
