import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getMovies } from '~/api/get-movies';
import { MoviesPage } from '~/components/movies-page';
import { assembleUrl, defaultQps, type QpSchema } from '~/data/query-params';
import { NAV } from '~/utils/nav-routes';

const qps: QpSchema = { ...defaultQps, movieMode: 'oscar', sort: 'total_oscar_wins', asc: false };

export const getStaticProps = (async () => {
  const url = assembleUrl(NAV.oscars.movies, qps);
  const response = await getMovies(qps);
  const data = { ...response, tokens: [] };
  return { props: { data, url } };
}) satisfies GetStaticProps;

export default function Movies(preloaded: InferGetStaticPropsType<typeof getStaticProps>) {
  return <MoviesPage preloaded={preloaded} />;
}
