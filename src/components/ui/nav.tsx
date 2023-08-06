import * as Nav from "@radix-ui/react-navigation-menu";
import { Icon } from "~/components/icons";
import Link from "next/link";
import { cn } from "~/lib/utils";

export const Navbar = () => {
  return (
    <Nav.Root
      className={cn(
        "fixed left-0 right-0 top-0 z-[9999] w-full flex-row",
        "space-x-3 bg-slate-800 font-semibold text-blue-50"
      )}
    >
      <Nav.List className="relative flex space-x-3 px-2">
        <Nav.Item>
          <Nav.Link asChild>
            <Link href="/tables/movies" className="flex py-2">
              All Movies
            </Link>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Trigger className="group flex py-2">
            Most Appearances{" "}
            <Icon.CaretDown
              className={cn(
                "ml-1",
                "duration-[250] transition-transform ease-in group-data-[state=open]:-rotate-180"
              )}
              aria-hidden
            />
          </Nav.Trigger>
          <Nav.Content className="absolute rounded-b-md bg-slate-600 shadow-lg">
            <Menu
              items={[
                { href: "/top/actors", text: "Actors" },
                { href: "/top/directors", text: "Directors" },
                { href: "/top/writers", text: "Writers" },
                { href: "/top/cinematographers", text: "Cinematographers" },
                { href: "/top/producers", text: "Producers" },
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
      <li key={item.href}>
        <Nav.Link asChild>
          <Link href={item.href} className="block p-1">
            {item.text}
          </Link>
        </Nav.Link>
      </li>
    ))}
  </ul>
);
