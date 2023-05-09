import Head from 'next/head';
import { PropsWithChildren, useState } from 'react';
import Link from 'next/link';

export default function Layout({
  className,
  children,
  title,
}: PropsWithChildren<{ className?: string; title: string }>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const linkClass = 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100';
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
        <nav className="sticky top-0 left-0 right-0 w-full p-3 flex space-x-3 bg-slate-800 font-semibold text-blue-50 ">
          <Link href="/tables/movies">All Movies</Link>
          <div className="relative">
            <button onClick={toggleDropdown} className="focus:outline-none">
              Most Appearances{' '}
              {dropdownOpen ? <span>&#x25B2;</span> : <span>&#x25BC;</span>}
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <Link href="/top/actors" className={linkClass}>
                    Actors
                  </Link>
                  <Link href="/top/directors" className={linkClass}>
                    Directors
                  </Link>
                  <Link href="/top/producers" className={linkClass}>
                    Producers
                  </Link>
                  <Link href="/top/writers" className={linkClass}>
                    Writers
                  </Link>
                  <Link href="/top/cinematographers" className={linkClass}>
                    Cinematographers
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
        <div className={className || 'mt-3'}>{children}</div>
      </div>
      ;
    </>
  );
}
