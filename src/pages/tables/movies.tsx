import Link from 'next/link';
import Image from 'next/image';
import Layout from '~/components/layout';
import { db } from '~/db/db';
import { PropsWithChildren, useMemo, useState } from 'react';
import { getByJob, moneyShort, smartSort } from '~/utils';
import tableStyles from '~/styles/tables.module.scss';
import { pick, zipObj } from 'remeda';
import { StaticProps, Streamer } from '~/types';
import { ImdbLink, SpotifyLink } from '~/components/external-links';

export const getStaticProps = async () => {
  const movies = db.movieByQuery('', (movie) => ({
    ...pick(movie, [
      'budget',
      'id',
      'imdb_id',
      'poster_path',
      'providers',
      'release_date',
      'revenue',
      'runtime',
      'title',
    ]),
    episodeNumber: movie.episode?.id || 0,
    hosts: movie.episode?.hosts || [],
    episodeUrl: movie.episode?.url || null,
    profit: movie.revenue - movie.budget,
    director: getByJob('director', movie.credits.crew)[0]?.name || '',
    directors: getByJob('director', movie.credits.crew).map((c) => c.name),
    writers: getByJob('writer', movie.credits.crew).map((c) => c.name),
    topCast: movie.credits.cast
      .sort((a, b) => a.order - b.order)
      .slice(0, 3)
      .map((c) => c.name),
  }));

  return {
    props: { movies },
  };
};

type SortableProp = (typeof sortables)[number];
const sortables = [
  'budget',
  'director',
  'episodeNumber',
  'profit',
  'release_date',
  'revenue',
  'runtime',
  'title',
] as const;
const SORT = zipObj(sortables, sortables);

export default function Movies({ movies }: StaticProps<typeof getStaticProps>) {
  const [asc, setAsc] = useState(true);
  const [orderBy, setOrderBy] = useState<SortableProp>('title');
  const [search, setSearch] = useState('');
  const [directorTokens, setDirectorTokens] = useState<string[]>([]);
  const [yearTokens, setYearTokens] = useState<string[]>([]);
  const [hostTokens, setHostTokens] = useState<string[]>([]);
  const [streamingTokens, setStreamingTokens] = useState<Streamer[]>([]);

  const movieList = useMemo(() => {
    const list = smartSort([...movies], orderBy);
    if (!asc) list.reverse();

    return list.filter((movie) => {
      if (search && !movie.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (
        directorTokens.length &&
        !directorTokens.every((token) => movie.directors.includes(token))
      ) {
        return false;
      }
      if (
        hostTokens.length &&
        !hostTokens.every((token) => movie.hosts.includes(token))
      ) {
        return false;
      }
      if (
        streamingTokens.length &&
        !streamingTokens.every((token) => movie.providers.includes(token))
      ) {
        return false;
      }
      if (yearTokens.length && !movie.release_date.includes(yearTokens[0])) {
        return false;
      }
      return true;
    });
  }, [
    asc,
    orderBy,
    search,
    movies,
    directorTokens,
    yearTokens,
    hostTokens,
    streamingTokens,
  ]);

  return (
    <Layout title="All movies" className="mt-3 mx-2">
      <div className="flex items-center my-2 py-2">
        <h2 className="text-xl font-semibold">{movieList.length} movies</h2>
        <input
          className="mx-2 p-1 border-slate-200 border-solid border-2"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title"
          value={search}
        />
        <select
          className="p-2"
          onChange={(e) => setOrderBy(e.target.value as SortableProp)}
          value={orderBy}
        >
          <option value={SORT.title}>Title</option>
          <option value={SORT.release_date}>Year</option>
          <option value={SORT.director}>Director</option>
          <option value={SORT.episodeNumber}>Episode</option>
          <option value={SORT.runtime}>Runtime</option>
          <option value={SORT.revenue}>Box Office</option>
          <option value={SORT.budget}>Budget</option>
          <option value={SORT.profit}>Profit</option>
        </select>
        <button className="text-lg ml-2" onClick={() => setAsc(!asc)}>
          {asc ? <span>&#8593;</span> : <span>&#8595;</span>}
        </button>
      </div>
      <div className="my-2">
        {yearTokens.map((year) => (
          <TableToken key={year} onClick={() => setYearTokens([])}>
            {year}
          </TableToken>
        ))}
        {directorTokens.map((director) => (
          <TableToken
            key={director}
            onClick={() =>
              setDirectorTokens(directorTokens.filter((h) => h !== director))
            }
          >
            {director}
          </TableToken>
        ))}
        {hostTokens.map((host) => (
          <TableToken
            key={host}
            onClick={() => setHostTokens(hostTokens.filter((h) => h !== host))}
          >
            {host}
          </TableToken>
        ))}
        {streamingTokens.map((streamer) => (
          <TableToken
            key={streamer}
            onClick={() =>
              setStreamingTokens(streamingTokens.filter((s) => s !== streamer))
            }
          >
            {streamer}
          </TableToken>
        ))}
      </div>
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
            <th>Links</th>
            <th>Box Office</th>
            <th>Budget</th>
            <th>Runtime</th>
          </tr>
        </thead>
        <tbody>
          {movieList.map((m, i) => (
            <tr
              key={m.id}
              className={`${(i + 1) % 2 && 'bg-slate-100'} text-left`}
            >
              <td>
                <Image
                  src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                  alt={`Movie poster for ${m.title}`}
                  width={42}
                  height={64}
                  className="border-slate-500 border-solid border-2"
                />
              </td>
              <td className="md:max-w-2xl">{m.title}</td>
              <td>
                <ClickableField
                  currentTokens={yearTokens}
                  fields={[new Date(m.release_date).getFullYear().toString()]}
                  setter={setYearTokens}
                />
              </td>
              <td>
                <ClickableField
                  currentTokens={directorTokens}
                  fields={m.directors}
                  setter={setDirectorTokens}
                />
              </td>
              <td>
                {m.topCast.map((c) => (
                  <div key={c}>{c}</div>
                ))}
              </td>
              <td>
                <ClickableField
                  currentTokens={hostTokens}
                  fields={m.hosts}
                  setter={setHostTokens}
                />
              </td>
              <td>
                <ClickableField
                  currentTokens={streamingTokens}
                  fields={m.providers}
                  setter={setStreamingTokens}
                />
              </td>
              <td>
                <div>
                  <ImdbLink id={m.imdb_id}>IMDB</ImdbLink>
                </div>
                <div>
                  {m.episodeUrl && (
                    <SpotifyLink url={m.episodeUrl}>Spotify</SpotifyLink>
                  )}
                </div>
              </td>
              <td>{moneyShort(m.revenue)}</td>
              <td>{moneyShort(m.budget)}</td>
              <td>{m.runtime} mins</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

type TableTokenProps = PropsWithChildren<{ onClick: (...args: any[]) => void }>;

const TableToken = ({ children, onClick }: TableTokenProps) => (
  <button
    className="p-1 mr-2 border-2 border-slate-700 rounded-md"
    onClick={() => onClick()}
  >
    {children}
    <span className="ml-2">&times;</span>
  </button>
);

type ClickableFieldProps = {
  fields: string[];
  currentTokens: string[];
  setter: (v: any[]) => void;
};

const ClickableField = ({
  currentTokens,
  fields,
  setter,
}: ClickableFieldProps) => {
  return (
    <>
      {fields.map((item) => (
        <div
          className="cursor-pointer"
          key={item}
          onClick={() => {
            if (!currentTokens.includes(item)) setter([...currentTokens, item]);
          }}
        >
          {item}&nbsp;
        </div>
      ))}
    </>
  );
};
