import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useState } from 'react';
import { range } from 'remeda';
import { getRewaMoviesGroupedByYear } from '~/apik/get-rewa-movies-grouped-by-year';
import { MoviePoster } from '~/components/images';
import { MovieCardSidebar } from '~/components/overlays/movie-card-sidebar';
import { cn } from '~/utils/style';
import { useSidebar } from '~/utils/use-sidebar';

export const getStaticProps = (async () => {
  const data = await getRewaMoviesGroupedByYear();
  return { props: { data } };
}) satisfies GetStaticProps;

// maybe just a table w/ posters

export default function Movies({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { sidebar, openSidebar, ...sidebarActions } = useSidebar<{
    variant: 'movie';
    movieId: number;
  }>();
  const [hoveredColumn, setHoveredColumn] = useState(-1);
  const length = Object.keys(data).reduce(
    (acc, year) => (data[year].length > acc ? data[year].length : acc),
    0
  );
  return (
    <>
      <table className="w-full">
        <thead>
          <tr>
            {range(0, length + 1).map(i => (
              <th
                key={i}
                className={cn(
                  'sticky top-0 bg-emerald-900 text-white',
                  hoveredColumn === i && 'bg-emerald-700'
                )}
              >
                {i ? i : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map(year => (
            <tr key={year} className="group hover:font-bold">
              <td className="pl-2">{year}</td>
              {range(0, length + 1).map(i => (
                <td
                  key={data[year][i]?.id || year + i}
                  onMouseOver={() => setHoveredColumn(i + 1)}
                  className={cn(hoveredColumn === i + 1 && 'bg-emerald-100')}
                  onClick={() => {
                    const movieId = data[year][i]?.id;
                    if (movieId) openSidebar({ variant: 'movie', movieId });
                  }}
                >
                  {data[year][i] ? (
                    <MoviePoster
                      className="cursor-pointer hover:scale-110 hover:drop-shadow-xl"
                      image={data[year][i].image}
                      variant="table"
                      title={data[year][i].title}
                    />
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sidebar?.variant === 'movie' && <MovieCardSidebar {...sidebar} {...sidebarActions} />}
    </>
  );
}
