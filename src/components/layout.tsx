import Head from "next/head";
import { PropsWithChildren } from "react";
import { Navbar } from "./ui/nav";

export default function Layout({ children, title }: PropsWithChildren<{ title: string }>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Movies from a podcast" />
        <meta name="og:title" content="Rewa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <Navbar />
        <div className="mx-2 mt-12">{children}</div>
      </div>
    </>
  );
}
