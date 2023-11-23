import { getMovies } from '~/api/get-movies';
import { MoviesPage } from '~/components/movies-page';
import { assembleUrl, defaultQps, type QpSchema } from '~/data/query-params';
import { type StaticProps } from '~/utils/general-types';

const qps: QpSchema = { ...defaultQps, hasEpisode: true, sort: 'episodeNumber', asc: false };

export const getStaticProps = async () => {
  const url = assembleUrl('/rewa/movies', qps);
  const response = await getMovies(qps);
  const data = { ...response, tokens: [] };
  return { props: { data, url } };
};

export default function Movies(preloaded: StaticProps<typeof getStaticProps>) {
  return <MoviesPage preloaded={preloaded} />;
}
