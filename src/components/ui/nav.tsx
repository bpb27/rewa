import * as Nav from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { Icon } from '~/components/ui/icons';
import { capitalize } from '~/utils/format';
import { NAV } from '~/utils/nav-routes';
import { cn } from '~/utils/style';
import { useMovieMode } from '~/utils/use-movie-mode';
import { useOverflowedOffScreen } from '~/utils/use-overflowed-off-screen';

// TODO: preserve params across mode
export const Navbar = () => {
  const mode = useMovieMode();
  return (
    <Nav.Root
      className={cn(
        'fixed left-0 right-0 top-0 z-[9999] w-full flex-row',
        'space-x-3 bg-slate-800 font-semibold tracking-wide text-blue-50'
      )}
    >
      <Nav.List className="relative flex space-x-3 px-2">
        <Nav.Item>
          <Nav.Trigger className="group flex space-x-2 py-2">
            <Icon.FilmStrip
              className={cn(
                mode === 'rewa' && 'text-green-300',
                mode === 'oscar' && 'text-yellow-300'
              )}
            />
            <span>{capitalize(mode)}</span>
          </Nav.Trigger>
          <Nav.Content className="absolute rounded-b-md bg-slate-600 shadow-lg">
            <Menu
              items={[
                { href: NAV.rewa.movies, text: 'Rewa' },
                { href: NAV.oscar.movies, text: 'Oscars' },
              ]}
            />
          </Nav.Content>
        </Nav.Item>
        {mode === 'rewa' && (
          <Nav.Item>
            <Nav.Link asChild>
              <Link href={NAV.rewa.movies} className="flex py-2">
                All Movies
              </Link>
            </Nav.Link>
          </Nav.Item>
        )}
        {mode === 'oscar' && (
          <Nav.Item>
            <Nav.Link asChild>
              <Link href={NAV.oscar.movies} className="flex py-2">
                All Movies
              </Link>
            </Nav.Link>
          </Nav.Item>
        )}
        <Nav.Item>
          <Nav.Trigger className="group flex py-2">
            Leaderboard{' '}
            <Icon.CaretDown
              className={cn(
                'ml-1',
                'transition-transform duration-200 ease-in group-data-[state=open]:-rotate-180'
              )}
              aria-hidden
            />
          </Nav.Trigger>
          {mode === 'rewa' && (
            <Menu
              items={[
                { href: NAV.rewa.top.actors, text: 'Actors' },
                { href: NAV.rewa.top.directors, text: 'Directors' },
                { href: NAV.rewa.top.writers, text: 'Writers' },
                { href: NAV.rewa.top.cinematographers, text: 'Cinematographers' },
                { href: NAV.rewa.top.producers, text: 'Producers' },
                // { href: NAV.rewa.top.companies, text: 'Production Companies' },
              ]}
            />
          )}
          {mode === 'oscar' && (
            <Menu
              items={[
                { href: NAV.oscar.top.actorsNoms, text: 'Actors (most noms)' },
                { href: NAV.oscar.top.actors, text: 'Actors (most films)' },
                { href: NAV.oscar.top.directorsNoms, text: 'Directors (most noms)' },
                { href: NAV.oscar.top.directors, text: 'Directors (most films)' },
                { href: NAV.oscar.top.writers, text: 'Writers' },
                { href: NAV.oscar.top.cinematographers, text: 'Cinematographers' },
                { href: NAV.oscar.top.producers, text: 'Producers' },
              ]}
            />
          )}
        </Nav.Item>
      </Nav.List>
    </Nav.Root>
  );
};

const Menu = ({ items }: { items: { href: string; text: string }[] }) => {
  const { offScreen, setOffScreenRef } = useOverflowedOffScreen();
  return (
    <Nav.Content
      ref={setOffScreenRef}
      className={cn('absolute rounded-b-md bg-slate-600 shadow-lg', offScreen ? 'right-0' : '')}
    >
      <ul className="p-3">
        {items.map(item => (
          <li key={item.href} className="hover:bg-slate-500">
            <Nav.Link asChild>
              <Link href={item.href} className="block p-1">
                {item.text}
              </Link>
            </Nav.Link>
          </li>
        ))}
      </ul>
    </Nav.Content>
  );
};
