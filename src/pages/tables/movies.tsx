import Link from 'next/link';
import Image from 'next/image';
import Layout from '~/components/layout';
import { db } from '~/db/db';
import { PropsWithChildren, useMemo, useState } from 'react';
import { getByJob, moneyShort, smartSort } from '~/utils';
import tableStyles from '~/styles/tables.module.scss';
import { pick, zipObj } from 'remeda';
import { StaticProps } from '~/types';

export const getStaticProps = async () => {
  const movies = db.movieByQuery('', (movie) => ({
    ...pick(movie, [
      'budget',
      'episode',
      'id',
      'poster_path',
      'release_date',
      'revenue',
      'runtime',
      'title',
    ]),
    episodeNumber: movie.episode?.id || 0,
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
  'director',
  'episodeNumber',
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

  const movieList = useMemo(() => {
    const list = smartSort([...movies], orderBy);
    if (!asc) list.reverse();

    return list.filter((movie) => {
      if (search && !movie.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (
        directorTokens.length &&
        !directorTokens.every((director) => movie.directors.includes(director))
      ) {
        return false;
      }
      if (
        hostTokens.length &&
        !hostTokens.every((host) => movie.episode?.hosts.includes(host))
      ) {
        return false;
      }
      if (yearTokens.length && !movie.release_date.includes(yearTokens[0])) {
        return false;
      }
      return true;
    });
  }, [asc, orderBy, search, movies, directorTokens, yearTokens, hostTokens]);

  return (
    <Layout title="All movies">
      <h1>All movies</h1>
      <h2>{movieList.length} results</h2>
      <div>
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
      </div>
      <div>
        <button onClick={() => setAsc(!asc)}>{asc ? 'Asc' : 'Desc'}</button>
        <select
          onChange={(e) => setOrderBy(e.target.value as SortableProp)}
          value={orderBy}
        >
          <option value={SORT.title}>Title</option>
          <option value={SORT.release_date}>Year</option>
          <option value={SORT.director}>Director</option>
          <option value={SORT.revenue}>Box Office</option>
          <option value={SORT.episodeNumber}>Episode</option>
          <option value={SORT.runtime}>Runtime</option>
        </select>
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search"
        />
      </div>
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th>Poster</th>
            <th>Title</th>
            <th>Year</th>
            <th>Director</th>
            <th>Top Cast</th>
            <th>Box Office</th>
            <th>Budget</th>
            <th>Runtime</th>
            <th>Hosts</th>
          </tr>
        </thead>
        <tbody>
          {movieList.map((m) => (
            <tr key={m.id}>
              <td>
                <Image
                  src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                  alt={`Movie poster for ${m.title}`}
                  width={42}
                  height={64}
                  style={{ border: '1px solid #00000078' }}
                />
              </td>
              <td>{m.title}</td>
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
              <td>{moneyShort(m.revenue)}</td>
              <td>{moneyShort(m.budget)}</td>
              <td>{m.runtime} mins</td>
              <td>
                <ClickableField
                  currentTokens={hostTokens}
                  fields={m.episode?.hosts || []}
                  setter={setHostTokens}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
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
  setter: (v: string[]) => void;
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
