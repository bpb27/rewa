import { useEffect, useState } from "react";
import useSWR from "swr";
import { GetMoviesBySearchResponse } from "~/pages/api/search/movie";
import { capitalize, fetcher } from "~/utils";
import { useDebounce } from "~/utils/use-debounce";
import { groupBy } from "remeda";
import { DialogOverlay } from "./ui/dialog";
import { Icon } from "./icons";
import { Button } from "./ui/button";

type FullTypeaheadProps = {
  onSelect: (selection: GetMoviesBySearchResponse[number]) => void;
};

export function FullTypeahead({ onSelect }: FullTypeaheadProps) {
  const [resultsContainer, setResultsContainer] = useState<HTMLDivElement | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data } = useSWR<GetMoviesBySearchResponse>(
    debouncedSearch ? `/api/search/movie?search=${debouncedSearch}` : null,
    fetcher
  );

  useEffect(() => {
    if (data?.length) setShowResults(true);
  }, [data, setShowResults]);

  useEffect(() => {
    if (!search) setShowResults(false);
  }, [search, setShowResults]);

  const byCategory = Object.entries(groupBy(data || [], item => item.type));

  return (
    <div className="relative" ref={setResultsContainer}>
      <input
        className="w-full rounded-lg border p-4 text-lg shadow-md outline-none"
        onChange={e => setSearch(e.target.value)}
        placeholder="Search titles, actors, hosts..."
        value={search}
      />
      <DialogOverlay
        className="border border-t-0 border-slate-400 bg-slate-100 p-3 shadow-2xl"
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
        {byCategory.map(([categoryName, entries]) => (
          <div key={categoryName} className="mb-2">
            <h6 className="mb-1">{capitalize(categoryName)}</h6>
            <div className="flex-col">
              {entries.map(item => (
                <button
                  className="flex text-left hover:underline"
                  key={[item.id, item.type].join("-")}
                  onClick={() => {
                    onSelect(item);
                    setSearch("");
                  }}
                >
                  {item.type === "movie" && <Icon.Movie />}
                  {item.type === "actor" && <Icon.Actor />}
                  {item.type === "host" && <Icon.Mic />}
                  <span className="ml-2">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </DialogOverlay>
    </div>
  );
}
