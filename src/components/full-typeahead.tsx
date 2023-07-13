import { Clapperboard, Mic, User2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { GetMoviesBySearchResponse } from '~/pages/api/search/movie';
import { capitalize, fetcher, useDebounce } from '~/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import { groupBy } from 'remeda';

type FullTypeaheadProps = {
  onSelect: (selection: GetMoviesBySearchResponse[number]) => void;
};

export function FullTypeahead({ onSelect }: FullTypeaheadProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data } = useSWR<GetMoviesBySearchResponse>(
    debouncedSearch ? `/api/search/movie?search=${debouncedSearch}` : null,
    fetcher
  );

  const byCategory = Object.entries(groupBy(data || [], (item) => item.type));

  return (
    <div className="relative">
      <Command className="rounded-lg border shadow-md" shouldFilter={false}>
        <CommandInput
          className="py-7 text-lg"
          placeholder="Search titles, actors, hosts..."
          onValueChange={setSearch}
          value={search}
        />
        <CommandList className="absolute left-0 top-full z-10 w-full bg-white">
          {data?.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
          {search &&
            byCategory.map(([categoryName, entries]) => (
              <CommandGroup
                heading={capitalize(categoryName)}
                key={categoryName}
              >
                {entries.map((item) => (
                  <CommandItem
                    key={`${item.id}-${item.type}`}
                    onSelect={() => {
                      onSelect(item);
                      setSearch('');
                    }}
                  >
                    {item.type === 'movie' && <Clapperboard />}
                    {item.type === 'actor' && <User2 />}
                    {item.type === 'host' && <Mic />}
                    <span className="ml-2">{item.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
        </CommandList>
      </Command>
    </div>
  );
}
