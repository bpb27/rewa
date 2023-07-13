import { ArrowDown, ArrowUp, ExternalLink, XCircle } from 'lucide-react';
import Image from 'next/image';
import Layout from '~/components/layout';
import { useEffect, useMemo, useRef, useState } from 'react';
import { moneyShort, smartSort, useVizSensor } from '~/utils';
import { mapValues, omit } from 'remeda';
import { StaticProps } from '~/types';
import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { FullTypeahead } from '~/components/full-typeahead';
import { Prisma } from '~/prisma';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const prisma = Prisma.getPrisma();
const selectIdAndName = { select: { id: true, name: true } };

export const getStaticProps = async () => {
  const data = await prisma.movies.findMany({
    orderBy: { title: 'asc' },
    select: {
      budget: true,
      id: true,
      imdb_id: true,
      poster_path: true,
      release_date: true,
      revenue: true, // NB: stored in DB as / 1000 due to BigInt shit
      runtime: true,
      title: true,
      actors_on_movies: {
        orderBy: { credit_order: 'asc' },
        select: { actors: selectIdAndName },
      },
      crew_on_movies: {
        where: { job: 'Director' },
        select: {
          job: true,
          crew: selectIdAndName,
        },
      },
      episodes: {
        select: {
          id: true,
          spotify_url: true,
          episode_order: true,
          hosts_on_episodes: { select: { hosts: selectIdAndName } },
        },
      },
      genres_on_movies: {
        select: { genres: selectIdAndName },
      },
      streamers_on_movies: {
        select: { streamers: selectIdAndName },
      },
    },
  });

  // TODO: fix bang by filtering nulls?
  const movies = data.map((movie) => ({
    ...omit(movie, [
      'actors_on_movies',
      'crew_on_movies',
      'genres_on_movies',
      'streamers_on_movies',
    ]),
    year: new Date(movie.release_date).getFullYear().toString(),
    actors: movie.actors_on_movies.map((jt) => jt.actors!).slice(0, 3),
    actorIds: movie.actors_on_movies.map((jt) => jt.actors?.id),
    crew: movie.crew_on_movies.map((jt) => ({ ...jt.crew!, job: jt.job })),
    genres: movie.genres_on_movies.map((jt) => jt.genres!),
    streamers: movie.streamers_on_movies.map((jt) => jt.streamers!),
    episode: movie.episodes.map((ep) => ({
      ...omit(ep, ['hosts_on_episodes']),
      hosts: ep.hosts_on_episodes.map((jt) => jt.hosts!),
    }))[0],
  }));

  return {
    props: { movies },
  };
};

type Props = StaticProps<typeof getStaticProps>;
type Movie = Props['movies'][number];
type SortProp = keyof typeof sorting;

export default function Movies({ movies }: Props) {
  const [asc, setAsc] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [orderBy, setOrderBy] = useState<SortProp>('episodeNumber');
  const [rowNumber, setRowNumber] = useState(20);
  const vizSensorRef = useRef<HTMLDivElement>(null);

  useVizSensor(vizSensorRef, {
    rootMargin: '200px',
    threshold: 0.1,
    callback: () => {
      setRowNumber(rowNumber + 20);
    },
  });

  const addToken = (newToken: Token) => {
    if (hasToken(tokens, newToken)) {
      setTokens(removeToken(tokens, newToken));
    } else {
      setTokens([...tokens, newToken]);
    }
  };

  const movieList = useMemo(() => {
    const list = smartSort([...movies], sorting[orderBy]);
    if (!asc) list.reverse();

    const movieTokens = tokens.filter((t) => t.type === 'movie');
    const directorTokens = tokens.filter((t) => t.type === 'director');
    const actorTokens = tokens.filter((t) => t.type === 'actor');
    const streamerTokens = tokens.filter((t) => t.type === 'streamer');
    const hostTokens = tokens.filter((t) => t.type === 'host');
    const yearTokens = tokens.filter((t) => t.type === 'year');
    const genreTokens = tokens.filter((t) => t.type === 'genres');
    const runtimeTokens = tokens.filter((t) => t.type === 'runtime');
    const budgetTokens = tokens.filter((t) => t.type === 'budget');
    const revenueTokens = tokens.filter((t) => t.type === 'revenue');

    return list.filter((movie) => {
      const actorIds = movie.actorIds;
      const directorIds = movie.crew.map((c) => c.id);
      const streamerIds = movie.streamers.map((c) => c.id);
      const hostIds = movie.episode.hosts.map((c) => c.id);
      const genreIds = movie.genres.map((c) => c.id);
      const yearIds = [Number(movie.year)];
      const movieIds = [movie.id];

      if (
        !directorTokens.every((t) => directorIds.includes(t.id)) ||
        !actorTokens.every((t) => actorIds.includes(t.id)) ||
        !streamerTokens.every((t) => streamerIds.includes(t.id)) ||
        !hostTokens.every((t) => hostIds.includes(t.id)) ||
        !yearTokens.every((t) => yearIds.includes(t.id)) ||
        !genreTokens.every((t) => genreIds.includes(t.id)) ||
        !movieTokens.every((t) => movieIds.includes(t.id)) ||
        !runtimeTokens.every((t) => Math.abs(t.id - movie.runtime) <= 10) ||
        !budgetTokens.every((t) => Math.abs(t.id - movie.budget) <= 10000000) ||
        !revenueTokens.every(
          (t) => Math.abs(t.id - movie.revenue * 1000) <= 10000000
        )
      ) {
        return false;
      }

      return true;
    });
  }, [asc, movies, orderBy, tokens]);

  useEffect(() => {
    setRowNumber(20);
  }, [movieList.length]);

  const sortProps = mapValues(sorting, (_value, key) => key);
  return (
    <Layout title="All movies">
      <div className="mb-2 mt-3 flex flex-col py-2">
        <FullTypeahead onSelect={(item) => addToken(item)} />
        <div>
          {tokens.length > 0 && (
            <Button variant="outline" onClick={() => setTokens([])}>
              Clear <XCircle className="ml-2 text-slate-600" />
            </Button>
          )}
          {tokens.map((token) => (
            <Button
              variant="outline"
              key={`${token.id}-${token.type}`}
              onClick={() => setTokens(removeToken(tokens, token))}
            >
              {token.name}
            </Button>
          ))}
        </div>
        <div className="mt-3 flex items-center">
          <h2 className="text-xl font-semibold">
            {movieList.length} movie{movieList.length === 1 ? '' : 's'}
          </h2>
          <Select
            value={orderBy}
            onValueChange={(value) => setOrderBy(value as SortProp)}
          >
            <SelectTrigger className="w-[180px]" margin="ml-4">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={sortProps.title}>Title</SelectItem>
              <SelectItem value={sortProps.release_date}>Year</SelectItem>
              <SelectItem value={sortProps.episodeNumber}>Episode</SelectItem>
              <SelectItem value={sortProps.runtime}>Runtime</SelectItem>
              <SelectItem value={sortProps.revenue}>Box Office</SelectItem>
              <SelectItem value={sortProps.budget}>Budget</SelectItem>
              <SelectItem value={sortProps.profit}>Profit %</SelectItem>
              <SelectItem value={sortProps.director}>Director</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setAsc(!asc)} variant="secondary" margin="m-2">
            {asc ? <ArrowUp /> : <ArrowDown />}
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left [&>th]:pr-6">
              <th>Poster</th>
              <th>Title</th>
              <th>Year</th>
              <th>Director</th>
              <th>Top Cast</th>
              <th>Hosts</th>
              <th>Streaming</th>
              <th>Box Office</th>
              <th>Budget</th>
              <th>Runtime</th>
              <th>Genres</th>
              <th>
                <div className="flex">
                  Links
                  <ExternalLink className="ml-2" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {movieList.slice(0, rowNumber).map((m, i) => (
              <tr
                key={m.id}
                className={`${
                  (i + 1) % 2 && 'bg-slate-100'
                } border-t-2 border-slate-200 text-left`}
              >
                <td>
                  <Image
                    src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                    alt={`Movie poster for ${m.title}`}
                    width={42}
                    height={64}
                    className="border-2 border-solid border-slate-500"
                  />
                </td>
                <td className="max-w-[200px]">{m.title}</td>
                <td>
                  <ClickableField
                    fields={[{ id: Number(m.year), name: m.year }]}
                    setter={addToken}
                    type="year"
                  />
                </td>
                <td>
                  <ClickableField
                    fields={m.crew}
                    setter={addToken}
                    type="director"
                  />
                </td>
                <td>
                  <ClickableField
                    fields={m.actors}
                    setter={addToken}
                    type="actor"
                  />
                </td>
                <td>
                  <ClickableField
                    fields={m.episode.hosts}
                    setter={addToken}
                    type="host"
                  />
                </td>
                <td>
                  <ClickableField
                    fields={m.streamers}
                    setter={addToken}
                    type="streamer"
                  />
                </td>
                <td>
                  <ClickableField
                    fields={[
                      {
                        name: `${moneyShort(m.revenue * 1000)}`,
                        id: m.revenue * 1000,
                      },
                    ]}
                    setter={addToken}
                    type="revenue"
                  />
                </td>
                <td>
                  <ClickableField
                    fields={[{ name: `${moneyShort(m.budget)}`, id: m.budget }]}
                    setter={addToken}
                    type="budget"
                  />
                </td>
                <td>
                  <ClickableField
                    fields={[{ name: `${m.runtime} mins`, id: m.runtime }]}
                    setter={addToken}
                    type="runtime"
                  />
                </td>
                <td>
                  <ClickableField
                    fields={m.genres}
                    setter={addToken}
                    type="genres"
                  />
                </td>
                <td>
                  <div>
                    <ImdbLink id={m.imdb_id}>IMDB</ImdbLink>
                  </div>
                  <div>
                    {m.episode.spotify_url && (
                      <SpotifyLink url={m.episode.spotify_url}>
                        Spotify
                      </SpotifyLink>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div ref={vizSensorRef}></div>
    </Layout>
  );
}

const sorting = Object.freeze({
  budget: (m: Movie) => m.budget,
  director: (m: Movie) => m.crew[0]?.name,
  episodeNumber: (m: Movie) => m.episode.episode_order,
  profit: (m: Movie) => (m.revenue * 1000) / m.budget,
  release_date: (m: Movie) => m.release_date,
  revenue: (m: Movie) => m.revenue,
  runtime: (m: Movie) => m.runtime,
  title: (m: Movie) => m.title,
});

type ClickableFieldProps = {
  fields: Omit<Token, 'type'>[];
  setter: (v: Token) => void;
  type: TokenType;
};

const ClickableField = ({ fields, setter, type }: ClickableFieldProps) => {
  return (
    <>
      {fields.map((item) => (
        <div
          className="cursor-pointer hover:font-semibold"
          key={item.name}
          onClick={() => setter({ ...item, type })}
        >
          {item.name}&nbsp;
        </div>
      ))}
    </>
  );
};

type TokenType =
  | 'director'
  | 'actor'
  | 'year'
  | 'host'
  | 'streamer'
  | 'genres'
  | 'movie'
  | 'runtime'
  | 'budget'
  | 'revenue';

type BaseToken = { id: number; name: string; type: TokenType };
type Token<TObject extends BaseToken = BaseToken> = TObject;

const removeToken = (tokens: Token[], { id, type }: Token) =>
  tokens.filter((t) => !(t.type === type && t.id === id));

const hasToken = (tokens: Token[], { id, type }: Token) =>
  !!tokens.find((t) => t.type === type && t.id === id);
