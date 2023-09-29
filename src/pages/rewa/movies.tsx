import { getMovies } from '~/api/get-movies';
import { MoviesPage } from '~/components/movie-table-page';
import { defaultQps, type QpSchema } from '~/data/query-params';
import { type StaticProps } from '~/utils/general-types';

const qps: QpSchema = { ...defaultQps, hasEpisode: true, sort: 'episodeNumber' };

export const getStaticProps = async () => {
  const movies = await getMovies(qps);
  const props = { initialData: { ...movies, tokens: [] } };
  return { props };
};

export default function Movies({ initialData }: StaticProps<typeof getStaticProps>) {
  return <MoviesPage initialData={initialData} defaultQps={qps} />;
}
