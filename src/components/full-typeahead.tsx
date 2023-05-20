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
    <div className="relative max-w-md mx-4">
      <input
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search titles, actors, hosts"
        type="search"
        value={search}
        onBlur={(e) => console.log(e)}
      />
      {showingDropdown && (
        <ul className="absolute z-2 w-full mt-2 bg-white border rounded-lg shadow-lg">
          {(results.data || []).map((item) => (
            <li
              className="p-2 border-b hover:bg-slate-200 cursor-pointer"
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
            <li className="p-2 border-b">
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
