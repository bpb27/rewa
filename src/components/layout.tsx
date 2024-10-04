import Head from 'next/head';
import { type PropsWithChildren } from 'react';
import { Navbar } from '~/components/ui/nav';

const metaName = 'Rewa';
const metaTitle = 'Rewa Movies';
const metaDesc = 'Explore movies from the podcast';
const metaSite = 'https://rewa.vercel.app';
const metaImg = 'https://rewa.vercel.app/site.webp';

export default function Layout({ children, title }: PropsWithChildren<{ title: string }>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content={metaDesc} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={metaName} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={metaSite} />
        <meta property="og:image" content={metaImg} />
        <meta property="og:image:type" content="image/png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={metaName} />
        <meta property="twitter:description" content={metaDesc} />
        <meta property="twitter:image" content={metaImg} />
      </Head>
      <div>
        <Navbar />
        <div className="mt-12">{children}</div>
      </div>
    </>
  );
}
