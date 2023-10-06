import * as Nav from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from '~/components/ui/icons';
import { capitalize } from '~/utils/format';
import { cn } from '~/utils/style';

export const Navbar = () => {
  const router = useRouter();
  const mode = router.asPath.includes('rewa') ? 'rewa' : 'oscars';
  return (
    <Nav.Root
      className={cn(
        'fixed left-0 right-0 top-0 z-[9999] w-full flex-row',
        'space-x-3 bg-slate-800 font-semibold text-blue-50'
      )}
    >
      <Nav.List className="relative flex space-x-3 px-2">
        <Nav.Item>
          <Nav.Trigger className="group flex py-2">
            <span
              className={cn(
                mode === 'rewa' && 'text-green-100',
                mode === 'oscars' && 'text-yellow-100'
              )}
            >
              {capitalize(mode)}
            </span>
            <Icon.CaretDown
              className={cn(
                'ml-1',
                'transition-transform duration-200 ease-in group-data-[state=open]:-rotate-180'
              )}
              aria-hidden
            />
          </Nav.Trigger>
          <Nav.Content className="absolute rounded-b-md bg-slate-600 shadow-lg">
            <Menu
              items={[
                { href: '/rewa/movies', text: 'Rewa' },
                { href: '/oscars/movies', text: 'Oscars' },
              ]}
            />
          </Nav.Content>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link asChild>
            <Link href={`/${mode}/movies`} className="flex py-2">
              All Movies
            </Link>
          </Nav.Link>
        </Nav.Item>
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
          <Nav.Content className="absolute rounded-b-md bg-slate-600 shadow-lg">
            <Menu
              items={[
                { href: `/${mode}/top/actors`, text: 'Actors' },
                { href: `/${mode}/top/directors`, text: 'Directors' },
                { href: `/${mode}/top/writers`, text: 'Writers' },
                { href: `/${mode}/top/cinematographers`, text: 'Cinematographers' },
                { href: `/${mode}/top/producers`, text: 'Producers' },
              ]}
            />
          </Nav.Content>
        </Nav.Item>
      </Nav.List>
    </Nav.Root>
  );
};

const Menu = ({ items }: { items: { href: string; text: string }[] }) => (
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
);
