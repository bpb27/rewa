import { useEffect, useState } from 'react';
import { groupBy } from 'remeda';
import { Button } from '~/components/ui/button';
import { DialogOverlay } from '~/components/ui/dialog';
import { Icon } from '~/components/ui/icons';
import { type QpSchema } from '~/data/query-params';
import { type Token } from '~/data/tokens';
import { capitalize } from '~/utils/format';
import { useAPI } from '~/utils/use-api';
import { useDebounce } from '~/utils/use-debounce';

type SearchBarProps = {
  filter: QpSchema['movieMode'];
  onSelect: (selection: Token) => void;
};

export const SearchBar = ({ filter, onSelect }: SearchBarProps) => {
  const [resultsContainer, setResultsContainer] = useState<HTMLDivElement | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useAPI(
    '/api/search',
    { search: debouncedSearch, filter },
    { skip: !debouncedSearch }
  );

  useEffect(() => {
    if (data?.length || isLoading) setShowResults(true);
  }, [data, isLoading, setShowResults]);

  useEffect(() => {
    if (!search) setShowResults(false);
  }, [search, setShowResults]);

  const byCategory = Object.entries(groupBy(data || [], item => item.type));

  return (
    <div className="relative" ref={setResultsContainer}>
      <input
        className="w-full rounded-lg border p-4 text-lg shadow-md outline-none"
        onChange={e => setSearch(e.target.value)}
        placeholder="Search titles, actors, keywords..."
        value={search}
      />
      <DialogOverlay
        className="min-w-[250px] border border-t-0 border-slate-400 bg-slate-100 p-3 shadow-2xl"
        container={resultsContainer}
        isOpen={showResults}
        onClose={() => setShowResults(false)}
      >
        <Button
          className="absolute -right-1 top-0 bg-transparent"
          onClick={() => setShowResults(false)}
          variant="icon"
        >
          <Icon.Close opacity="50%" />
        </Button>
        {isLoading && (
          <div className="mt-6">
            <LoadingBar />
            <LoadingBar />
            <LoadingBar />
          </div>
        )}
        {!data?.length && !!search && !isLoading && (
          <div className="mt-3 flex space-x-2">
            <Icon.FaceMeh />
            <span>Nah.</span>
          </div>
        )}
        {byCategory.map(([categoryName, entries]) => (
          <div key={categoryName} className="mb-2">
            <h6 className="mb-1">{capitalize(categoryName)}</h6>
            <div className="flex-col">
              {entries.map(item => (
                <button
                  className="flex text-left hover:underline"
                  key={[item.id, item.type].join('-')}
                  onClick={() => {
                    onSelect(item);
                    setSearch('');
                  }}
                >
                  {item.type === 'movie' && <Icon.Movie />}
                  {item.type === 'actor' && <Icon.Actor />}
                  {item.type === 'host' && <Icon.Mic />}
                  {item.type === 'director' && <Icon.Video />}
                  {item.type === 'streamer' && <Icon.Tv />}
                  {item.type === 'keyword' && <Icon.Key />}
                  <span className="ml-2">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </DialogOverlay>
    </div>
  );
};

const LoadingBar = () => (
  <div className="my-2 h-4 w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />
);