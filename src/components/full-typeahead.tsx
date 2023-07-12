import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { GetMoviesBySearchResponse } from '~/pages/api/search/movie';
import { fetcher, useDebounce } from '~/utils';

type FullTypeaheadProps = {
  onSelect: (selection: GetMoviesBySearchResponse[number]) => void;
};

export const FullTypeahead = ({ onSelect }: FullTypeaheadProps) => {
  const [search, setSearch] = useState('');
  const [showingDropdown, showDropdown] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const results = useSWR<GetMoviesBySearchResponse>(
    `/api/search/movie?search=${debouncedSearch}`,
    fetcher
  );

  useEffect(() => {
    if (!search) showDropdown(false);
    if (search && results.data) showDropdown(true);
  }, [results.data, search]);

  return (
    <div className="relative w-full">
      <input
        className="w-full rounded-sm border-2 border-slate-400 p-4 text-xl text-gray-700 focus:outline-none sm:rounded-lg"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search titles, actors, hosts"
        type="search"
        value={search}
      />
      {showingDropdown && (
        <ul
          className="z-2 absolute mt-2 w-full rounded-lg border bg-white shadow-lg"
          onBlur={() => showDropdown(false)}
        >
          {(results.data || []).map((item) => (
            <li
              className="cursor-pointer border-b p-2 hover:bg-slate-200"
              key={`${item.type}-${item.id}`}
              onClick={() => {
                onSelect(item);
                setSearch('');
              }}
            >
              <div className="flex justify-between">
                <span>{item.name}</span>
                <span className="text-xs text-gray-500">{item.type}</span>
              </div>
            </li>
          ))}
          {results.data?.length === 0 && (
            <li className="border-b p-2">
              <div className="flex justify-between">
                <span>No results</span>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
