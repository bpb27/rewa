import { MoviesPage } from '~/components/movies-page';
import { assembleUrl, defaultQps, type QpSchema } from '~/data/query-params';
import { trpcVanilla } from '~/trpc/client';
import { type StaticProps } from '~/utils/general-types';
import { NAV } from '~/utils/nav-routes';

const qps: QpSchema = { ...defaultQps, movieMode: 'oscar', sort: 'total_oscar_wins', asc: false };

export const getStaticProps = async () => {
  const url = assembleUrl(NAV.oscar.movies, qps);
  const response = await trpcVanilla.getMovies.query(qps);
  const data = { ...response, tokens: [] };
  return { props: { data, url } };
};

export default function Movies(preloaded: StaticProps<typeof getStaticProps>) {
  return <MoviesPage preloaded={preloaded} />;
}
